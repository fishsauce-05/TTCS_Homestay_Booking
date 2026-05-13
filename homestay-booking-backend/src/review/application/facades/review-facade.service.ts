import { Injectable } from '@nestjs/common';
import { CreateReviewCommand } from '../commands/create-review/create-review.command';
import { DeleteReviewCommand } from '../commands/delete-review/delete-review.command';
import { ReplyReviewCommand } from '../commands/reply-review/reply-review.command';
import { CreateReviewHandler } from '../commands/create-review/create-review.command-handler';
import { DeleteReviewHandler } from '../commands/delete-review/delete-review.command-handler';
import { GetHomestayReviewsHandler } from '../queries/get-homestay-reviews/get-homestay-reviews.query-handler';
import { GetReviewDetailHandler } from '../queries/get-review-detail/get-review-detail.query-handler';
import { ReplyReviewHandler } from '../commands/reply-review/reply-review.command-handler';
import { GetHomestayReviewsQuery } from '../queries/get-homestay-reviews/get-homestay-reviews.query';
import { GetReviewDetailQuery } from '../queries/get-review-detail/get-review-detail.query';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { ReviewReplyDto } from '../../dto/review-reply.dto';

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
    return this.createReviewHandler.execute(
      new CreateReviewCommand(homestayId, userId, createReviewDto),
    );
  }

  getReviewsByHomestay(homestayId: string) {
    return this.getHomestayReviewsHandler.execute(
      new GetHomestayReviewsQuery(homestayId),
    );
  }

  getReviewById(id: string) {
    return this.getReviewDetailHandler.execute(new GetReviewDetailQuery(id));
  }

  reply(reviewId: string, userId: string, reviewReplyDto: ReviewReplyDto) {
    return this.replyReviewHandler.execute(
      new ReplyReviewCommand(reviewId, userId, reviewReplyDto),
    );
  }

  deleteReview(id: string, userId: string) {
    return this.deleteReviewHandler.execute(
      new DeleteReviewCommand(id, userId),
    );
  }
}
