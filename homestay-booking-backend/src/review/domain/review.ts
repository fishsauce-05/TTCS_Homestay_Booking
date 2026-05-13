export class ReviewDomain {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly homestayId: string,
    readonly rating: number,
    readonly comment: string,
  ) {}
}
