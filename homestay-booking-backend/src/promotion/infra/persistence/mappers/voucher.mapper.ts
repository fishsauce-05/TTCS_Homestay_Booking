import { Voucher } from '../../../domain/voucher';
import { Voucher as VoucherEntity } from '../entities/voucher.entity';

export class VoucherMapper {
  static toDomain(entity: VoucherEntity): Voucher {
    return new Voucher(
      entity.id,
      entity.code,
      entity.name,
      entity.description,
      entity.type,
      Number(entity.discountValue),
      entity.status,
      entity.expiryDate,
      entity.startDate,
      entity.maxUses,
      entity.usedCount,
      entity.minOrderValue === null ? null : Number(entity.minOrderValue),
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Voucher): Partial<VoucherEntity> {
    return {
      id: domain.id,
      userId: domain.userId,
      code: domain.code,
      name: domain.name,
      description: domain.description,
      discountValue: domain.discountValue,
      type: domain.type,
      startDate: domain.startDate,
      expiryDate: domain.expiryDate,
      maxUses: domain.maxUses,
      usedCount: domain.usedCount,
      minOrderValue: domain.minOrderValue,
      status: domain.status,
    };
  }
}
