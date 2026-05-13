export class PaymentResponseDto {
  paymentId!: string;
  bookingId!: string;
  amount!: number;
  status!: string;
  createdAt!: Date;
  paidAt?: Date | null;
  reportedAt?: Date | null;
  reviewedAt?: Date | null;
  message?: string;
}
