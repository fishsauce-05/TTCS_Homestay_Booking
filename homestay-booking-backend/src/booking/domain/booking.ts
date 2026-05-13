import { BookingStatus } from './booking-status';

export class BookingDomain {
  constructor(
    readonly id: string,
    readonly status: BookingStatus,
    readonly totalPrice: number,
    readonly checkInDate: string,
    readonly voucherId: string | null,
  ) {}
}
