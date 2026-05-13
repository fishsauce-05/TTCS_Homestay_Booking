import { Inject, Injectable } from '@nestjs/common';
import { BookingDomain } from '../../../domain/booking';
import { GetMyBookingsQuery } from './get-my-bookings.query';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';

@Injectable()
export class GetMyBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(query: GetMyBookingsQuery): Promise<BookingDomain[]> {
    return this.bookings.findByUser(query.userId);
  }
}
