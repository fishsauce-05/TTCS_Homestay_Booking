import { IsOptional, IsString, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class UpdatePricingScheduleDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerNight?: number;
}
