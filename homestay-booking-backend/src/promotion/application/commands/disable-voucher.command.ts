export class DisableVoucherCommand {
  constructor(
    readonly voucherId: string,
    readonly disabled?: boolean,
  ) {}
}
