import { VoucherStatus, VoucherType } from '../../common/enums';

export class Voucher {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public name: string | null,
    public description: string | null,
    public type: VoucherType,
    public discountValue: number,
    public status: VoucherStatus,
    public expiryDate: Date,
    public startDate: string | null,
    public maxUses: number | null,
    public usedCount: number,
    public minOrderValue: number | null,
    public readonly userId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
