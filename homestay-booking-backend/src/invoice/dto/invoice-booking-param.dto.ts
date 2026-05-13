import { IsUUID } from 'class-validator';

export class InvoiceBookingParamDto {
  @IsUUID()
  bookingId!: string;
}
