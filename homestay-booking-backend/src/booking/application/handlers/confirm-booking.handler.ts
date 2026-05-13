import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '../../../common/enums';
import { Booking } from '../../entities/booking.entity';
import { ConfirmBookingCommand } from '../commands/confirm-booking.command';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';

@Injectable()
export class ConfirmBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<Booking> {
    const booking = await this.bookings.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Chi co the xac nhan booking dang cho');
    booking.status = BookingStatus.CONFIRMED;
    return this.bookings.save(booking);
  }
}
