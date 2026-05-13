import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Booking } from '../../entities/booking.entity';
import { GetBookingDetailQuery } from '../queries/get-booking-detail.query';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';

@Injectable()
export class GetBookingDetailHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  async execute(query: GetBookingDetailQuery): Promise<Booking> {
    const booking = await this.bookings.findById(query.bookingId);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    return booking;
  }
}
