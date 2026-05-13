export class VoucherRedemption {
  constructor(
    readonly id: string,
    readonly bookingId: string,
    readonly voucherId: string,
    readonly userId: string,
    readonly voucherCode: string,
    readonly redeemedAt: Date,
  ) {}
}
