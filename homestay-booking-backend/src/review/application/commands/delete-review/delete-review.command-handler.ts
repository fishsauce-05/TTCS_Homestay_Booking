import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewPolicy } from '../../../domain/review-policy';
import { DeleteReviewCommand } from './delete-review.command';
import { REVIEW_REPOSITORY } from '../../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../../ports/review-repository.port';

@Injectable()
export class DeleteReviewHandler {
  private readonly policy = new ReviewPolicy();

  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  async execute(command: DeleteReviewCommand): Promise<{ message: string }> {
    const review = await this.reviews.findById(command.reviewId);
    if (!review) throw new NotFoundException('Review khong ton tai');
    this.policy.assertCanDelete(review, command.userId);
    await this.reviews.remove(review);
    return { message: 'Review da xoa' };
  }
}
