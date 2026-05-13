import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Voucher } from '../../../domain/voucher';
import { UpdateVoucherCommand } from './update-voucher.command';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';

@Injectable()
export class UpdateVoucherHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(command: UpdateVoucherCommand): Promise<Voucher> {
    const voucher = await this.vouchers.findById(command.voucherId);
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');
    Object.assign(voucher, command.dto);
    return this.vouchers.save(voucher);
  }
}
