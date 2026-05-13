import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedeemVoucherCommand } from './redeem-voucher.command';
import { PROMOTION_USAGE_COUNTER } from '../../ports/promotion-usage-counter.port';
import { REDEMPTION_REPOSITORY } from '../../ports/redemption-repository.port';
import { VOUCHER_REPOSITORY } from '../../ports/voucher-repository.port';
import type { PromotionUsageCounterPort } from '../../ports/promotion-usage-counter.port';
import type { RedemptionRepositoryPort } from '../../ports/redemption-repository.port';
import type { VoucherRepositoryPort } from '../../ports/voucher-repository.port';

@Injectable()
export class RedeemVoucherHandler {
  constructor(
    @Inject(REDEMPTION_REPOSITORY)
    private readonly redemptions: RedemptionRepositoryPort,
    @Inject(VOUCHER_REPOSITORY)
    private readonly vouchers: VoucherRepositoryPort,
    @Inject(PROMOTION_USAGE_COUNTER)
    private readonly usageCounter: PromotionUsageCounterPort,
  ) {}

  async execute(command: RedeemVoucherCommand): Promise<{
    success: boolean;
    redemptionId: string;
    idempotent: boolean;
  }> {
    const booking = await this.redemptions.findBookingById(
      command.dto.bookingId,
    );
    if (!booking) throw new NotFoundException('Booking khong ton tai');

    const code = command.dto.voucherCode.trim().toUpperCase();
    if (!code) throw new BadRequestException('Voucher code la bat buoc');

    const voucher = await this.vouchers.findByCode(code);
    if (!voucher) throw new NotFoundException('Voucher khong ton tai');

    const existing = await this.redemptions.findByBookingAndVoucher(
      booking.id,
      voucher.id,
    );
    if (existing) {
      return { success: true, redemptionId: existing.id, idempotent: true };
    }

    const saved = await this.redemptions.create({
      bookingId: booking.id,
      voucherId: voucher.id,
      userId: command.dto.userId ?? booking.userId,
      voucherCode: voucher.code,
    });

    if (booking.voucherId !== voucher.id) {
      await this.usageCounter.increment(voucher.id);
    }

    return { success: true, redemptionId: saved.id, idempotent: false };
  }
}
