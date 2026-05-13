import {
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  bookingId!: string;

  @IsString()
  @MaxLength(255)
  customerName!: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  roomName?: string | null;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  homestayName?: string | null;

  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsInt()
  @Min(1)
  numberOfNights!: number;

  @IsNumber()
  @Min(0)
  pricePerNight!: number;

  @IsNumber()
  @Min(0)
  roomPrice!: number;

  @IsNumber()
  @Min(0)
  discountAmount!: number;

  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  penaltyAmount?: number | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  refundAmount?: number | null;

  @IsString()
  @MaxLength(20)
  invoiceType!: string;

  @IsDate()
  @IsOptional()
  paymentDate?: Date | null;
}
