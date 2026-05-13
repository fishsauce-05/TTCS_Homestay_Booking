import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '../../entities/booking.entity';
import { GetOwnerBookingsQuery } from '../queries/get-owner-bookings.query';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';

@Injectable()
export class GetOwnerBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(query: GetOwnerBookingsQuery): Promise<Booking[]> {
    return this.bookings.findByHomestay(query.homestayId);
  }
}
