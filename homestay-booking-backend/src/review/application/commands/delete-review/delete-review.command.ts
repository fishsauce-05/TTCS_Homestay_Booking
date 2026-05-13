export class DeleteReviewCommand {
  constructor(
    readonly reviewId: string,
    readonly userId: string,
  ) {}
}
