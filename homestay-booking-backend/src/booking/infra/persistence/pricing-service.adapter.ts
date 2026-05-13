import { Injectable } from '@nestjs/common';
import { PricingScheduleService } from '../../../pricing-schedule/pricing-schedule.service';
import { PricingPort } from '../../application/ports/pricing.port';

@Injectable()
export class PricingServiceAdapter implements PricingPort {
  constructor(
    private readonly pricingScheduleService: PricingScheduleService,
  ) {}

  calculateTotalPrice(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
  ) {
    return this.pricingScheduleService.calculateTotalPrice(
      roomId,
      checkInDate,
      checkOutDate,
    );
  }
}
