export const BOOKING_VOUCHER = Symbol('BOOKING_VOUCHER');

export interface BookingVoucherPort {
  validateById(
    voucherId: string,
    totalPrice: number,
  ): Promise<{ id: string; discountAmount: number }>;
  validateByCode(
    code: string,
    totalPrice: number,
  ): Promise<{ id: string; discountAmount: number }>;
  incrementUsage(voucherId: string): Promise<void>;
  decrementUsage(voucherId: string): Promise<void>;
}
