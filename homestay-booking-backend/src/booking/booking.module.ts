import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './presentation/booking.controller';
import { Booking } from './entities/booking.entity';
import { Voucher } from '../promotion/infrastructure/persistence/entities/voucher.entity';
import { PricingScheduleModule } from '../pricing-schedule/pricing-schedule.module';
import { RoomModule } from '../room/room.module';
import { CalculatePriceHandler } from './application/handlers/calculate-price.handler';
import { CancelBookingHandler } from './application/handlers/cancel-booking.handler';
import { CompleteBookingHandler } from './application/handlers/complete-booking.handler';
import { ConfirmBookingHandler } from './application/handlers/confirm-booking.handler';
import { CreateBookingHandler } from './application/handlers/create-booking.handler';
import { GetAllBookingsHandler } from './application/handlers/get-all-bookings.handler';
import { GetBookingDetailHandler } from './application/handlers/get-booking-detail.handler';
import { GetMyBookingsHandler } from './application/handlers/get-my-bookings.handler';
import { GetOwnerBookingsHandler } from './application/handlers/get-owner-bookings.handler';
import { GetRoomBookingsHandler } from './application/handlers/get-room-bookings.handler';
import { BOOKING_INVOICE } from './application/ports/invoice.port';
import { BOOKING_LOCK } from './application/ports/booking-lock.port';
import { BOOKING_PAYMENT } from './application/ports/payment.port';
import { BOOKING_REPOSITORY } from './application/ports/booking-repository.port';
import { BOOKING_VOUCHER } from './application/ports/voucher.port';
import { PRICING } from './application/ports/pricing.port';
import { ROOM_AVAILABILITY } from './application/ports/room-availability.port';
import { NoopBookingLock } from './infrastructure/locks/noop-booking-lock';
import { NoopBookingInvoiceAdapter } from './infrastructure/persistence/noop-booking-invoice.adapter';
import { NoopBookingPaymentAdapter } from './infrastructure/persistence/noop-booking-payment.adapter';
import { PricingServiceAdapter } from './infrastructure/persistence/pricing-service.adapter';
import { TypeOrmBookingRepository } from './infrastructure/persistence/typeorm-booking.repository';
import { TypeOrmRoomAvailabilityAdapter } from './infrastructure/persistence/typeorm-room-availability.adapter';
import { TypeOrmVoucherAdapter } from './infrastructure/persistence/typeorm-voucher.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Voucher]),
    PricingScheduleModule,
    RoomModule,
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
