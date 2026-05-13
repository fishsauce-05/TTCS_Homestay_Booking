import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '../../../../common/enums';
import { NotificationService } from '../../../../notification/notification.service';
import { BookingDomain } from '../../../domain/booking';
import { ConfirmBookingCommand } from './confirm-booking.command';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';

@Injectable()
export class ConfirmBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<BookingDomain> {
    const booking = await this.bookings.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Chi co the xac nhan booking dang cho');
    booking.status = BookingStatus.CONFIRMED;
    const saved = await this.bookings.save(booking);
    await this.notificationService.create({
      userId: booking.userId,
      title: 'Booking da duoc xac nhan',
      message: 'Chu nha da xac nhan booking cua ban.',
      type: 'booking_confirmed',
      data: { bookingId: saved.id },
    });
    return saved;
  }
}
