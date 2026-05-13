import { Injectable } from '@nestjs/common';
import { CreateReviewCommand } from './application/commands/create-review.command';
import { DeleteReviewCommand } from './application/commands/delete-review.command';
import { ReplyReviewCommand } from './application/commands/reply-review.command';
import { CreateReviewHandler } from './application/handlers/create-review.handler';
import { DeleteReviewHandler } from './application/handlers/delete-review.handler';
import { GetHomestayReviewsHandler } from './application/handlers/get-homestay-reviews.handler';
import { GetReviewDetailHandler } from './application/handlers/get-review-detail.handler';
import { ReplyReviewHandler } from './application/handlers/reply-review.handler';
import { GetHomestayReviewsQuery } from './application/queries/get-homestay-reviews.query';
import { GetReviewDetailQuery } from './application/queries/get-review-detail.query';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewReplyDto } from './dto/review-reply.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly createReviewHandler: CreateReviewHandler,
    private readonly deleteReviewHandler: DeleteReviewHandler,
    private readonly getHomestayReviewsHandler: GetHomestayReviewsHandler,
    private readonly getReviewDetailHandler: GetReviewDetailHandler,
    private readonly replyReviewHandler: ReplyReviewHandler,
  ) {}

  create(homestayId: string, userId: string, createReviewDto: CreateReviewDto) {
    return this.createReviewHandler.execute(new CreateReviewCommand(homestayId, userId, createReviewDto));
  }

  getReviewsByHomestay(homestayId: string) {
    return this.getHomestayReviewsHandler.execute(new GetHomestayReviewsQuery(homestayId));
  }

  getReviewById(id: string) {
    return this.getReviewDetailHandler.execute(new GetReviewDetailQuery(id));
  }

  reply(reviewId: string, userId: string, reviewReplyDto: ReviewReplyDto) {
    return this.replyReviewHandler.execute(new ReplyReviewCommand(reviewId, userId, reviewReplyDto));
  }

  deleteReview(id: string, userId: string) {
    return this.deleteReviewHandler.execute(new DeleteReviewCommand(id, userId));
  }
}
