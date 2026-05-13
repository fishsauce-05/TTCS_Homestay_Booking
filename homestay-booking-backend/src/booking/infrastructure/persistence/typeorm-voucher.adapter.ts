import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoucherStatus } from '../../../common/enums';
import { Voucher } from '../../../promotion/infrastructure/persistence/entities/voucher.entity';
import { BookingVoucherPort } from '../../application/ports/voucher.port';

@Injectable()
export class TypeOrmVoucherAdapter implements BookingVoucherPort {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async validateById(voucherId: string, totalPrice: number): Promise<{ id: string; discountAmount: number }> {
    const voucher = await this.voucherRepo.findOne({ where: { id: voucherId } });
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');
    return this.validate(voucher, totalPrice);
  }

  async validateByCode(code: string, totalPrice: number): Promise<{ id: string; discountAmount: number }> {
    const voucher = await this.voucherRepo.findOne({ where: { code: code.trim().toUpperCase() } });
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');
    return this.validate(voucher, totalPrice);
  }

  async incrementUsage(voucherId: string): Promise<void> {
    await this.voucherRepo.increment({ id: voucherId }, 'usedCount', 1);
  }

  async decrementUsage(voucherId: string): Promise<void> {
    await this.voucherRepo.decrement({ id: voucherId }, 'usedCount', 1);
  }

  private validate(voucher: Voucher, totalPrice: number): { id: string; discountAmount: number } {
    if (voucher.status !== VoucherStatus.ACTIVE) throw new BadRequestException('Ma giam gia khong hoat dong');
    const today = new Date().toISOString().split('T')[0];
    if (voucher.startDate && today < voucher.startDate) throw new BadRequestException('Ma giam gia chua den ngay hieu luc');
    if (new Date(voucher.expiryDate) < new Date()) throw new BadRequestException('Ma giam gia da het han su dung');
    if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) throw new BadRequestException('Ma giam gia da het so luot su dung');
    if (voucher.minOrderValue !== null && totalPrice < Number(voucher.minOrderValue)) {
      throw new BadRequestException(`Don hang chua dat gia tri toi thieu de ap dung ma giam gia (${Number(voucher.minOrderValue).toLocaleString()} VND)`);
    }
    const discountAmount = voucher.type === 'fixed'
      ? Math.min(Number(voucher.discountValue), totalPrice)
      : Math.floor((totalPrice * Number(voucher.discountValue)) / 100);
    return { id: voucher.id, discountAmount };
  }
}
