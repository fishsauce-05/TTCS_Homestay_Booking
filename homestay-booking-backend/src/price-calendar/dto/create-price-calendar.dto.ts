import { IsUUID, IsDateString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePriceCalendarDto {
  @IsUUID()
  homestayId: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
