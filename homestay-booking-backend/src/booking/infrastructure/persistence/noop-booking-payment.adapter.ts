import { Injectable } from '@nestjs/common';
import { BookingPaymentPort } from '../../application/ports/payment.port';

@Injectable()
export class NoopBookingPaymentAdapter implements BookingPaymentPort {
  async cancelForBooking(_bookingId: string): Promise<void> {}
}
