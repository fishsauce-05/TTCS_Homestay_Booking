export class RedeemableBooking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly voucherId: string | null,
  ) {}
}
