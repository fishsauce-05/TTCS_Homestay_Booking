import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceCalendarModule } from 'src/price-calendar/price-calendar.module';
import { VoucherModule } from 'src/voucher/voucher.module';
import { HomestayModule } from 'src/homestay/homestay.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]),
    PriceCalendarModule,
    VoucherModule,
    HomestayModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
