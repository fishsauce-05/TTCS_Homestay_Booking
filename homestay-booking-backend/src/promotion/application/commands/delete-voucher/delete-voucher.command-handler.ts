import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteVoucherCommand } from './delete-voucher.command';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';

@Injectable()
export class DeleteVoucherHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(command: DeleteVoucherCommand): Promise<{ message: string }> {
    const voucher = await this.vouchers.findById(command.voucherId);
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');
    await this.vouchers.remove(voucher);
    return { message: 'Xoa voucher thanh cong' };
  }
}
