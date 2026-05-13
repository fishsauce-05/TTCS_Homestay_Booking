import { Booking } from '../../../booking/entities/booking.entity';
import { VoucherRedemption } from '../../infrastructure/persistence/entities/voucher-redemption.entity';

export const REDEMPTION_REPOSITORY = Symbol('REDEMPTION_REPOSITORY');

export interface RedemptionRepositoryPort {
  findBookingById(id: string): Promise<Booking | null>;
  findByBookingAndVoucher(bookingId: string, voucherId: string): Promise<VoucherRedemption | null>;
  create(data: Pick<VoucherRedemption, 'bookingId' | 'voucherId' | 'userId' | 'voucherCode'>): Promise<VoucherRedemption>;
}
