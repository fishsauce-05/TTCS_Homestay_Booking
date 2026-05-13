import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../entities/review.entity';
import { ReplyReviewCommand } from '../commands/reply-review.command';
import { REVIEW_REPOSITORY } from '../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../ports/review-repository.port';

@Injectable()
export class ReplyReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  async execute(command: ReplyReviewCommand): Promise<Review> {
    const review = await this.reviews.findById(command.reviewId);
    if (!review) throw new NotFoundException('Review không tồn tại');
    review.ownerReply = command.dto.ownerReply;
    review.ownerId = command.ownerId;
    review.replyAt = new Date();
    return this.reviews.save(review);
  }
}
