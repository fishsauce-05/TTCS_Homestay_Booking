import { ReviewReplyDto } from '../../dto/review-reply.dto';

export class ReplyReviewCommand {
  constructor(
    readonly reviewId: string,
    readonly ownerId: string,
    readonly dto: ReviewReplyDto,
  ) {}
}
