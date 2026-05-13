export class Redemption {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly voucherId: string,
    public readonly userId: string,
    public readonly voucherCode: string,
    public readonly createdAt?: Date,
  ) {}
}
