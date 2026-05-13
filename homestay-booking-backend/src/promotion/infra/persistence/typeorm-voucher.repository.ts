import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoucherStatus } from '../../../common/enums';
import { Voucher as VoucherDomain } from '../../domain/voucher';
import { VoucherRepositoryPort } from '../../application/ports/voucher-repository.port';
import { CreateVoucherDto } from '../../presenters/http/dto/create-voucher.dto';
import { Voucher } from './entities/voucher.entity';
import { VoucherMapper } from './mappers/voucher.mapper';

@Injectable()
export class TypeOrmVoucherRepository implements VoucherRepositoryPort {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async create(dto: CreateVoucherDto, adminId: string): Promise<VoucherDomain> {
    const voucher = this.voucherRepo.create({
      userId: adminId,
      code: dto.code.trim().toUpperCase(),
      name: dto.name ?? null,
      description: dto.description ?? null,
      discountValue: dto.discountValue,
      type: dto.type,
      startDate: dto.startDate
        ? dto.startDate.toISOString().split('T')[0]
        : null,
      expiryDate: dto.expiryDate,
      maxUses: dto.maxUses ?? null,
      usedCount: 0,
      minOrderValue: dto.minOrderValue ?? null,
      status: VoucherStatus.ACTIVE,
    });
    return VoucherMapper.toDomain(await this.voucherRepo.save(voucher));
  }

  async findAll(): Promise<VoucherDomain[]> {
    const vouchers = await this.voucherRepo.find({
      order: { createdAt: 'DESC' },
    });
    return vouchers.map((voucher) => VoucherMapper.toDomain(voucher));
  }

  async findById(id: string): Promise<VoucherDomain | null> {
    const voucher = await this.voucherRepo.findOne({ where: { id } });
    return voucher ? VoucherMapper.toDomain(voucher) : null;
  }

  async findByCode(code: string): Promise<VoucherDomain | null> {
    const voucher = await this.voucherRepo.findOne({
      where: { code: code.trim().toUpperCase() },
    });
    return voucher ? VoucherMapper.toDomain(voucher) : null;
  }

  async save(voucher: VoucherDomain): Promise<VoucherDomain> {
    const saved = await this.voucherRepo.save(
      VoucherMapper.toPersistence(voucher),
    );
    return VoucherMapper.toDomain(saved);
  }

  async remove(voucher: VoucherDomain): Promise<void> {
    await this.voucherRepo.delete(voucher.id);
  }
}
