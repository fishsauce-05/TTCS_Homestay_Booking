export const BOOKING_INVOICE = Symbol('BOOKING_INVOICE');

export interface BookingInvoicePort {
  createForBooking(_bookingId: string): Promise<void>;
}
