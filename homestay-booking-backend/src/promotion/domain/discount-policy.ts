import { VoucherType } from '../../common/enums';
import { Voucher } from './voucher';

export class DiscountPolicy {
  calculate(voucher: Voucher, totalPrice: number): number {
    if (voucher.type === VoucherType.FIXED || voucher.type === ('fixed' as VoucherType)) {
      return Math.min(voucher.discountValue, totalPrice);
    }

    return Math.floor((totalPrice * voucher.discountValue) / 100);
  }
}
