import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Voucher } from '../../../domain/voucher';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';
import { GetVoucherDetailQuery } from './get-voucher-detail.query';

@Injectable()
export class GetVoucherDetailHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(query: GetVoucherDetailQuery): Promise<Voucher> {
    const voucher = await this.vouchers.findById(query.voucherId);
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');
    return voucher;
  }
}
