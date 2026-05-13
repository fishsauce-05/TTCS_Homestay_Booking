export class ValidateVoucherQuery {
  constructor(
    readonly code: string,
    readonly totalPrice: number,
  ) {}
}
