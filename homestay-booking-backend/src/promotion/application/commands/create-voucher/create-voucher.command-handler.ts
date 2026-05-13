import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Voucher } from '../../../domain/voucher';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';
import { CreateVoucherCommand } from './create-voucher.command';

@Injectable()
export class CreateVoucherHandler {
  constructor(
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
  ) {}

  async execute(command: CreateVoucherCommand): Promise<Voucher> {
    const existing = await this.vouchers.findByCode(command.dto.code);
    if (existing) throw new BadRequestException('Ma giam gia da ton tai');
    return this.vouchers.create(command.dto, command.adminId);
  }
}
