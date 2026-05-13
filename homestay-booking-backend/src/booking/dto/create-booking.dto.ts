import { IsUUID, IsDateString, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  roomId!: string;

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

  @IsString()
  @IsOptional()
  voucherCode?: string;
}
