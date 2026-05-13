import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '../../../common/enums';
import { Booking } from '../../entities/booking.entity';
import { CancellationPolicy } from '../../domain/cancellation-policy';
import { CancelBookingCommand } from '../commands/cancel-booking.command';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import { BOOKING_PAYMENT } from '../ports/payment.port';
import { BOOKING_VOUCHER } from '../ports/voucher.port';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';
import type { BookingPaymentPort } from '../ports/payment.port';
import type { BookingVoucherPort } from '../ports/voucher.port';

@Injectable()
export class CancelBookingHandler {
  private readonly cancellationPolicy = new CancellationPolicy();

  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
    @Inject(BOOKING_VOUCHER)
    private readonly vouchers: BookingVoucherPort,
    @Inject(BOOKING_PAYMENT)
    private readonly payments: BookingPaymentPort,
  ) {}

  async execute(command: CancelBookingCommand): Promise<Booking & { penaltyPercent: number }> {
    const booking = await this.bookings.findById(command.bookingId);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status === BookingStatus.COMPLETED) throw new BadRequestException('Khong the huy booking da hoan thanh');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('Booking da bi huy roi');

    const penalty = this.cancellationPolicy.calculate(Number(booking.totalPrice), booking.checkInDate);
    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = command.cancellationReason || null;
    booking.penaltyAmount = penalty.penaltyAmount;
    booking.refundAmount = penalty.refundAmount;

    const saved = await this.bookings.save(booking);
    if (booking.voucherId) await this.vouchers.decrementUsage(booking.voucherId);
    await this.payments.cancelForBooking(booking.id);
    return { ...saved, penaltyPercent: penalty.penaltyPercent };
  }
}
