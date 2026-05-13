import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '../../../../common/enums';
import { NotificationService } from '../../../../notification/notification.service';
import { BookingDomain } from '../../../domain/booking';
import { CompleteBookingCommand } from './complete-booking.command';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import { BOOKING_INVOICE } from '../../ports/invoice.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';
import type { BookingInvoicePort } from '../../ports/invoice.port';

@Injectable()
export class CompleteBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
    @Inject(BOOKING_INVOICE)
    private readonly invoices: BookingInvoicePort,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: CompleteBookingCommand): Promise<BookingDomain> {
    const booking = await this.bookings.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status !== BookingStatus.CONFIRMED)
      throw new BadRequestException(
        'Chi co the hoan thanh booking da xac nhan',
      );
    booking.status = BookingStatus.COMPLETED;
    const saved = await this.bookings.save(booking);
    await this.invoices.createForBooking(saved.id);
    await this.notificationService.create({
      userId: booking.userId,
      title: 'Booking da hoan thanh',
      message: 'Booking cua ban da hoan thanh. Hoa don da duoc tao.',
      type: 'booking_completed',
      data: { bookingId: saved.id },
    });
    return saved;
  }
}
