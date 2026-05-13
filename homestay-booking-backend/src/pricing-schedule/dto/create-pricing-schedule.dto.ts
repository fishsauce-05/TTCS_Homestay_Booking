import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreatePricingScheduleDto {
  @IsNotEmpty()
  @IsString()
  roomId!: string;

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endDate!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  pricePerNight!: number;
}
