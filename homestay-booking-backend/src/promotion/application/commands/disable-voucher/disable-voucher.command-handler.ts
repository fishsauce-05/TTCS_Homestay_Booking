import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VoucherStatus } from '../../../../common/enums';
import { Voucher } from '../../../domain/voucher';
import { DisableVoucherCommand } from './disable-voucher.command';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';

@Injectable()
export class DisableVoucherHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(command: DisableVoucherCommand): Promise<Voucher> {
    const voucher = await this.vouchers.findById(command.voucherId);
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');

    if (command.disabled === undefined) {
      voucher.status =
        voucher.status === VoucherStatus.ACTIVE
          ? VoucherStatus.INACTIVE
          : VoucherStatus.ACTIVE;
    } else {
      voucher.status = command.disabled
        ? VoucherStatus.INACTIVE
        : VoucherStatus.ACTIVE;
    }

    return this.vouchers.save(voucher);
  }
}
