import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Voucher as VoucherDomain } from '../../domain/voucher';
import { DiscountPolicy } from '../../domain/discount-policy';
import { VoucherEligibilityPolicy } from '../../domain/voucher-eligibility-policy';
import { VOUCHER_REPOSITORY } from '../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../ports/voucher-repository.port';
import { ValidateVoucherQuery } from '../queries/validate-voucher.query';

@Injectable()
export class ValidateVoucherHandler {
  private readonly discountPolicy = new DiscountPolicy();
  private readonly eligibilityPolicy = new VoucherEligibilityPolicy();

  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(query: ValidateVoucherQuery): Promise<{
    valid: boolean;
    discountAmount: number;
    voucherId: string;
    code: string;
    type: string;
    discountValue: number;
    name: string | null;
    message?: string;
  }> {
    const voucher = await this.vouchers.findByCode(query.code);
    if (!voucher) throw new NotFoundException('Ma giam gia khong hop le hoac khong ton tai');

    const domainVoucher = VoucherDomain.fromEntity(voucher);
    this.eligibilityPolicy.assertEligible(domainVoucher, query.totalPrice);

    return {
      valid: true,
      discountAmount: this.discountPolicy.calculate(domainVoucher, query.totalPrice),
      voucherId: voucher.id,
      code: voucher.code,
      type: voucher.type,
      discountValue: Number(voucher.discountValue),
      name: voucher.name,
      message: 'Voucher hop le',
    };
  }
}
