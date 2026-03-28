import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePriceCalendarDto {
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
