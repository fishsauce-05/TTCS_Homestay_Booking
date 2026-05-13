import { Inject, Injectable } from '@nestjs/common';
import { BookingDomain } from '../../../domain/booking';
import { GetAllBookingsQuery } from './get-all-bookings.query';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';

@Injectable()
export class GetAllBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(_query: GetAllBookingsQuery): Promise<BookingDomain[]> {
    return this.bookings.findAll();
  }
}
