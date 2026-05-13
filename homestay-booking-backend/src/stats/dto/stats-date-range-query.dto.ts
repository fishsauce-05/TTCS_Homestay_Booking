import { BadRequestException } from '@nestjs/common';
import { IsDateString } from 'class-validator';

export class StatsDateRangeQueryDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  validateDateRange(): void {
    if (new Date(this.startDate) > new Date(this.endDate)) {
      throw new BadRequestException('startDate phải nhỏ hơn hoặc bằng endDate');
    }
  }
}
