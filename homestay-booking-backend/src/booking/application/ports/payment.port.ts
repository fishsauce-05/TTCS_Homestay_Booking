export const BOOKING_PAYMENT = Symbol('BOOKING_PAYMENT');

export interface BookingPaymentPort {
  cancelForBooking(_bookingId: string): Promise<void>;
}
