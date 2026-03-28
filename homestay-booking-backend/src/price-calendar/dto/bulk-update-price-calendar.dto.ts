import { IsUUID, IsDateString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class BulkUpdatePriceCalendarDto {
  @IsUUID()
  homestayId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
