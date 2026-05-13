import { Injectable } from '@nestjs/common';
import { BookingInvoicePort } from '../../application/ports/invoice.port';

@Injectable()
export class NoopBookingInvoiceAdapter implements BookingInvoicePort {
  async createForBooking(_bookingId: string): Promise<void> {}
}
