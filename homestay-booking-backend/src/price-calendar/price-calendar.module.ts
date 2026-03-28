import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceCalendarService } from './price-calendar.service';
import { PriceCalendarController } from './price-calendar.controller';
import { PriceCalendar } from './entities/price-calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceCalendar])],
  controllers: [PriceCalendarController],
  providers: [PriceCalendarService],
  exports: [PriceCalendarService],
})
export class PriceCalendarModule {}
