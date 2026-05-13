import { Inject, Injectable } from '@nestjs/common';
import { BookingDomain } from '../../../domain/booking';
import { GetOwnerBookingsQuery } from './get-owner-bookings.query';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';

@Injectable()
export class GetOwnerBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(query: GetOwnerBookingsQuery): Promise<BookingDomain[]> {
    return this.bookings.findByHomestay(query.homestayId);
  }
}
