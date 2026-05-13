import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './presenters/http/booking.controller';
import { Booking } from './entities/booking.entity';
import { Voucher } from '../promotion/infra/persistence/entities/voucher.entity';
import { PricingScheduleModule } from '../pricing-schedule/pricing-schedule.module';
import { RoomModule } from '../room/room.module';
import { NotificationModule } from '../notification/notification.module';
import { CalculatePriceHandler } from './application/queries/calculate-price/calculate-price.query-handler';
import { CancelBookingHandler } from './application/commands/cancel-booking/cancel-booking.command-handler';
import { CompleteBookingHandler } from './application/commands/complete-booking/complete-booking.command-handler';
import { ConfirmBookingHandler } from './application/commands/confirm-booking/confirm-booking.command-handler';
import { CreateBookingHandler } from './application/commands/create-booking/create-booking.command-handler';
import { GetAllBookingsHandler } from './application/queries/get-all-bookings/get-all-bookings.query-handler';
import { GetBookingDetailHandler } from './application/queries/get-booking-detail/get-booking-detail.query-handler';
import { GetMyBookingsHandler } from './application/queries/get-my-bookings/get-my-bookings.query-handler';
import { GetOwnerBookingsHandler } from './application/queries/get-owner-bookings/get-owner-bookings.query-handler';
import { GetRoomBookingsHandler } from './application/queries/get-room-bookings/get-room-bookings.query-handler';
import { BOOKING_INVOICE } from './application/ports/invoice.port';
import { BOOKING_LOCK } from './application/ports/booking-lock.port';
import { BOOKING_PAYMENT } from './application/ports/payment.port';
import { BOOKING_REPOSITORY } from './application/ports/booking-repository.port';
import { BOOKING_VOUCHER } from './application/ports/voucher.port';
import { PRICING } from './application/ports/pricing.port';
import { ROOM_AVAILABILITY } from './application/ports/room-availability.port';
import { NoopBookingLock } from './infra/locks/noop-booking-lock';
import { NoopBookingInvoiceAdapter } from './infra/persistence/noop-booking-invoice.adapter';
import { NoopBookingPaymentAdapter } from './infra/persistence/noop-booking-payment.adapter';
import { PricingServiceAdapter } from './infra/persistence/pricing-service.adapter';
import { TypeOrmBookingRepository } from './infra/persistence/typeorm-booking.repository';
import { TypeOrmRoomAvailabilityAdapter } from './infra/persistence/typeorm-room-availability.adapter';
import { TypeOrmVoucherAdapter } from './infra/persistence/typeorm-voucher.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Voucher]),
    PricingScheduleModule,
    RoomModule,
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    CalculatePriceHandler,
    CancelBookingHandler,
    CompleteBookingHandler,
    ConfirmBookingHandler,
    CreateBookingHandler,
    GetAllBookingsHandler,
    GetBookingDetailHandler,
    GetMyBookingsHandler,
    GetOwnerBookingsHandler,
    GetRoomBookingsHandler,
    TypeOrmBookingRepository,
    TypeOrmRoomAvailabilityAdapter,
    PricingServiceAdapter,
    TypeOrmVoucherAdapter,
    NoopBookingLock,
    NoopBookingPaymentAdapter,
    NoopBookingInvoiceAdapter,
    { provide: BOOKING_REPOSITORY, useExisting: TypeOrmBookingRepository },
    { provide: ROOM_AVAILABILITY, useExisting: TypeOrmRoomAvailabilityAdapter },
    { provide: PRICING, useExisting: PricingServiceAdapter },
    { provide: BOOKING_VOUCHER, useExisting: TypeOrmVoucherAdapter },
    { provide: BOOKING_LOCK, useExisting: NoopBookingLock },
    { provide: BOOKING_PAYMENT, useExisting: NoopBookingPaymentAdapter },
    { provide: BOOKING_INVOICE, useExisting: NoopBookingInvoiceAdapter },
  ],
  exports: [BookingService],
})
export class BookingModule {}
