import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoucherStatus } from '../../../common/enums';
import { VoucherRepositoryPort } from '../../application/ports/voucher-repository.port';
import { CreateVoucherDto } from '../../presentation/dto/create-voucher.dto';
import { Voucher } from './entities/voucher.entity';

@Injectable()
export class TypeOrmVoucherRepository implements VoucherRepositoryPort {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async create(dto: CreateVoucherDto, adminId: string): Promise<Voucher> {
    const voucher = this.voucherRepo.create({
      userId: adminId,
      code: dto.code.trim().toUpperCase(),
      name: dto.name ?? null,
      description: dto.description ?? null,
      discountValue: dto.discountValue,
      type: dto.type,
      startDate: dto.startDate ? dto.startDate.toISOString().split('T')[0] : null,
      expiryDate: dto.expiryDate,
      maxUses: dto.maxUses ?? null,
      usedCount: 0,
      minOrderValue: dto.minOrderValue ?? null,
      status: VoucherStatus.ACTIVE,
    });
    return this.voucherRepo.save(voucher);
  }

  findAll(): Promise<Voucher[]> {
    return this.voucherRepo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<Voucher | null> {
    return this.voucherRepo.findOne({ where: { id } });
  }

  findByCode(code: string): Promise<Voucher | null> {
    return this.voucherRepo.findOne({ where: { code: code.trim().toUpperCase() } });
  }

  save(voucher: Voucher): Promise<Voucher> {
    return this.voucherRepo.save(voucher);
  }

  async remove(voucher: Voucher): Promise<void> {
    await this.voucherRepo.remove(voucher);
  }
}
