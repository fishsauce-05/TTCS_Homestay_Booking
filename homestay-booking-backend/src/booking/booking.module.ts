import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceCalendarModule } from 'src/price-calendar/price-calendar.module';
import { HomestayModule } from 'src/homestay/homestay.module';
import { VoucherRedemptionModule } from 'src/voucher-redemption/voucher-redemption.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]),
    PriceCalendarModule,
    VoucherRedemptionModule,
    HomestayModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
