import { IsUUID, IsDateString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  homestayId!: string;

  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsInt()
  @Min(1)
  numberOfGuests!: number;

  @IsUUID()
  @IsOptional()
  voucherId?: string;
}
