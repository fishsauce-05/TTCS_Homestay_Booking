import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../voucher/entities/voucher.entity';
import { VoucherRedemption } from './entities/voucher-redemption.entity';

@Injectable()
export class VoucherRedemptionService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherRedemption)
    private readonly redemptionRepository: Repository<VoucherRedemption>,
  ) {}

  async getVoucherById(voucherId: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({ where: { id: voucherId } });
    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }
    return voucher;
  }

  async validateVoucherForBooking(voucherId: string): Promise<Voucher> {
    const voucher = await this.getVoucherById(voucherId);

    if (new Date(voucher.expiryDate) < new Date()) {
      throw new BadRequestException('Voucher đã hết hạn');
    }

    if (voucher.maxUses) {
      const usageCount = await this.redemptionRepository.count({ where: { voucherId } });
      if (usageCount >= voucher.maxUses) {
        throw new BadRequestException('Voucher đã hết lượt sử dụng');
      }
    }

    return voucher;
  }

  calculateDiscount(discountValue: number, type: string, totalPrice: number): number {
    if (type === 'fixed') {
      return Math.min(discountValue, totalPrice);
    }

    return Math.floor((totalPrice * discountValue) / 100);
  }

  async reserveVoucher(voucherId: string, bookingId: string, userId: string, discountAmount: number): Promise<VoucherRedemption> {
    await this.validateVoucherForBooking(voucherId);

    const existingRedemption = await this.redemptionRepository.findOne({ where: { bookingId } });
    if (existingRedemption) {
      throw new BadRequestException('Booking này đã áp dụng voucher');
    }

    const redemption = this.redemptionRepository.create({
      voucherId,
      bookingId,
      userId,
      discountAmount,
    });

    return this.redemptionRepository.save(redemption);
  }

  async releaseByBookingId(bookingId: string): Promise<void> {
    await this.redemptionRepository.delete({ bookingId });
  }

  async getAllRedemptions(): Promise<VoucherRedemption[]> {
    return this.redemptionRepository.find({
      relations: ['voucher', 'booking', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRedemptionsByVoucherId(voucherId: string): Promise<VoucherRedemption[]> {
    return this.redemptionRepository.find({
      where: { voucherId },
      relations: ['voucher', 'booking', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRedemptionByBookingId(bookingId: string): Promise<VoucherRedemption | null> {
    return this.redemptionRepository.findOne({
      where: { bookingId },
      relations: ['voucher', 'booking', 'user'],
    });
  }
}
