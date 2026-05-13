export class CancelBookingCommand {
  constructor(
    readonly bookingId: string,
    readonly cancellationReason: string,
  ) {}
}
