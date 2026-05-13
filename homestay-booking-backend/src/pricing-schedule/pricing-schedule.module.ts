import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingSchedule } from './entities/pricing-schedule.entity';
import { PricingScheduleService } from './pricing-schedule.service';
import { PricingScheduleController } from './pricing-schedule.controller';
import { Room } from '../room/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingSchedule, Room])],
  controllers: [PricingScheduleController],
  providers: [PricingScheduleService],
  exports: [PricingScheduleService],
})
export class PricingScheduleModule {}
