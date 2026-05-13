import { BookingStatus } from './booking-status';

export class BookingDomain {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roomId: string,
    public checkInDate: string,
    public checkOutDate: string,
    public numberOfNights: number,
    public numberOfGuests: number,
    public pricePerNight: number,
    public roomPrice: number,
    public discountAmount: number,
    public totalPrice: number,
    public voucherId: string | null,
    public penaltyAmount: number | null,
    public refundAmount: number | null,
    public status: BookingStatus,
    public cancellationReason: string | null = null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly user?: unknown,
    public readonly room?: any,
  ) {}
}
