import { RedeemableBooking } from '../../domain/redeemable-booking';
import { Redemption } from '../../domain/redemption';

export const REDEMPTION_REPOSITORY = Symbol('REDEMPTION_REPOSITORY');

export interface RedemptionRepositoryPort {
  findBookingById(id: string): Promise<RedeemableBooking | null>;
  findByBookingAndVoucher(
    bookingId: string,
    voucherId: string,
  ): Promise<Redemption | null>;
  create(
    data: Pick<
      Redemption,
      'bookingId' | 'voucherId' | 'userId' | 'voucherCode'
    >,
  ): Promise<Redemption>;
}
