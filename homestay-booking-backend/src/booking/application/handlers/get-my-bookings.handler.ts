import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '../../entities/booking.entity';
import { GetMyBookingsQuery } from '../queries/get-my-bookings.query';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';

@Injectable()
export class GetMyBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(query: GetMyBookingsQuery): Promise<Booking[]> {
    return this.bookings.findByUser(query.userId);
  }
}
