import { VoucherStatus, VoucherType } from '../../common/enums';
import { Voucher as VoucherEntity } from '../infrastructure/persistence/entities/voucher.entity';

export class Voucher {
  constructor(
    readonly id: string,
    readonly code: string,
    readonly type: VoucherType,
    readonly discountValue: number,
    readonly status: VoucherStatus,
    readonly expiryDate: Date,
    readonly startDate: string | null,
    readonly maxUses: number | null,
    readonly usedCount: number,
    readonly minOrderValue: number | null,
  ) {}

  static fromEntity(entity: VoucherEntity): Voucher {
    return new Voucher(
      entity.id,
      entity.code,
      entity.type,
      Number(entity.discountValue),
      entity.status,
      entity.expiryDate,
      entity.startDate,
      entity.maxUses,
      entity.usedCount,
      entity.minOrderValue === null ? null : Number(entity.minOrderValue),
    );
  }
}
