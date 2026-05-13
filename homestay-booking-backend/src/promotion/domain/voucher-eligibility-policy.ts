import { BadRequestException } from '@nestjs/common';
import { VoucherStatus } from '../../common/enums';
import { Voucher } from './voucher';

export class VoucherEligibilityPolicy {
  assertEligible(voucher: Voucher, totalPrice: number): void {
    if (voucher.status !== VoucherStatus.ACTIVE) {
      throw new BadRequestException('Ma giam gia khong hoat dong');
    }

    const today = new Date().toISOString().split('T')[0];
    if (voucher.startDate && today < voucher.startDate) {
      throw new BadRequestException('Ma giam gia chua den ngay hieu luc');
    }

    if (new Date(voucher.expiryDate) < new Date()) {
      throw new BadRequestException('Ma giam gia da het han su dung');
    }

    if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) {
      throw new BadRequestException('Ma giam gia da het so luot su dung');
    }

    if (voucher.minOrderValue !== null && totalPrice < voucher.minOrderValue) {
      throw new BadRequestException(
        `Don hang chua dat gia tri toi thieu de ap dung ma giam gia (${voucher.minOrderValue.toLocaleString()} VND)`,
      );
    }
  }
}
