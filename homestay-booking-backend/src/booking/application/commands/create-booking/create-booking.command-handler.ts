import { Inject, Injectable } from '@nestjs/common';
import { BookingStatus } from '../../../../common/enums';
import { NotificationService } from '../../../../notification/notification.service';
import { BookingDomain } from '../../../domain/booking';
import { BookingPolicy } from '../../../domain/booking-policy';
import { RoomAvailabilityPolicy } from '../../../domain/room-availability-policy';
import { CreateBookingCommand } from './create-booking.command';
import { BOOKING_LOCK } from '../../ports/booking-lock.port';
import { BOOKING_REPOSITORY } from '../../ports/booking-repository.port';
import { PRICING } from '../../ports/pricing.port';
import { ROOM_AVAILABILITY } from '../../ports/room-availability.port';
import { BOOKING_VOUCHER } from '../../ports/voucher.port';
import type { BookingLockPort } from '../../ports/booking-lock.port';
import type { BookingRepositoryPort } from '../../ports/booking-repository.port';
import type { PricingPort } from '../../ports/pricing.port';
import type { RoomAvailabilityPort } from '../../ports/room-availability.port';
import type { BookingVoucherPort } from '../../ports/voucher.port';

@Injectable()
export class CreateBookingHandler {
  private readonly bookingPolicy = new BookingPolicy();
  private readonly availabilityPolicy = new RoomAvailabilityPolicy();

  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
    @Inject(ROOM_AVAILABILITY)
    private readonly rooms: RoomAvailabilityPort,
    @Inject(PRICING)
    private readonly pricing: PricingPort,
    @Inject(BOOKING_VOUCHER)
    private readonly vouchers: BookingVoucherPort,
    @Inject(BOOKING_LOCK)
    private readonly bookingLock: BookingLockPort,
    private readonly notificationService: NotificationService,
  ) {}

  execute(command: CreateBookingCommand): Promise<BookingDomain> {
    const { roomId } = command.dto;
    return this.bookingLock.withRoomLock(roomId, () => this.create(command));
  }

  private async create(command: CreateBookingCommand): Promise<BookingDomain> {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, voucherCode } =
      command.dto;
    let { voucherId } = command.dto;

    this.bookingPolicy.assertValidDateRange(checkInDate, checkOutDate);
    const room = await this.rooms.getRoom(roomId);
    this.bookingPolicy.assertRoomCapacity(room.capacity, numberOfGuests);

    const hasConflict = await this.rooms.hasConflict(
      roomId,
      checkInDate,
      checkOutDate,
    );
    this.availabilityPolicy.assertNoConflict(hasConflict);

    const price = await this.pricing.calculateTotalPrice(
      roomId,
      checkInDate,
      checkOutDate,
    );
    let discountAmount = 0;
    if (voucherId) {
      const voucher = await this.vouchers.validateById(
        voucherId,
        price.totalPrice,
      );
      discountAmount = voucher.discountAmount;
      await this.vouchers.incrementUsage(voucher.id);
    } else if (voucherCode) {
      const voucher = await this.vouchers.validateByCode(
        voucherCode,
        price.totalPrice,
      );
      voucherId = voucher.id;
      discountAmount = voucher.discountAmount;
      await this.vouchers.incrementUsage(voucher.id);
    }

    const booking = this.bookings.create({
      userId: command.userId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfNights: price.numberOfNights,
      numberOfGuests,
      pricePerNight: price.pricePerNight,
      roomPrice: price.totalPrice,
      discountAmount,
      totalPrice: price.totalPrice - discountAmount,
      voucherId: voucherId || null,
      penaltyAmount: null,
      refundAmount: null,
      status: BookingStatus.PENDING,
    });

    const saved = await this.bookings.save(booking);
    const full = await this.bookings.findById(saved.id);
    await this.notificationService.create({
      userId: saved.userId,
      title: 'Dat phong thanh cong',
      message: 'Booking cua ban da duoc tao va dang cho xac nhan.',
      type: 'booking_created',
      data: { bookingId: saved.id },
    });
    if (full?.room?.homestay?.userId) {
      await this.notificationService.create({
        userId: full.room.homestay.userId,
        title: 'Co dat phong moi',
        message: 'Ban co mot dat phong moi dang cho xac nhan.',
        type: 'booking_new',
        data: { bookingId: saved.id },
      });
    }
    return saved;
  }
}
