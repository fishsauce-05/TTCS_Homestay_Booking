import { Inject, Injectable } from '@nestjs/common';
import { BookingDomain } from '../../../domain/booking';
import { GetRoomBookingsQuery } from './get-room-bookings.query';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';

@Injectable()
export class GetRoomBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  execute(query: GetRoomBookingsQuery): Promise<BookingDomain[]> {
    return this.bookings.findByRoom(query.roomId);
  }
}
