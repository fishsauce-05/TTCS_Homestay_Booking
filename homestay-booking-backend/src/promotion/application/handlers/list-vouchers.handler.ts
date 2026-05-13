import { Inject, Injectable } from '@nestjs/common';
import { Voucher } from '../../infrastructure/persistence/entities/voucher.entity';
import { ListVouchersQuery } from '../queries/list-vouchers.query';
import { VOUCHER_REPOSITORY } from '../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../ports/voucher-repository.port';

@Injectable()
export class ListVouchersHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  execute(_query: ListVouchersQuery): Promise<Voucher[]> {
    return this.vouchers.findAll();
  }
}
