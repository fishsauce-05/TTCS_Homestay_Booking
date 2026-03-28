import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;

  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
