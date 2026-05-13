import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVoucherRedemptionDto {
  @IsUUID()
  bookingId!: string;

  @IsString()
  voucherCode!: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
