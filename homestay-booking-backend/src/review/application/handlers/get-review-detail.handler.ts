import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../entities/review.entity';
import { REVIEW_REPOSITORY } from '../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../ports/review-repository.port';
import { GetReviewDetailQuery } from '../queries/get-review-detail.query';

@Injectable()
export class GetReviewDetailHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  async execute(query: GetReviewDetailQuery): Promise<Review> {
    const review = await this.reviews.findById(query.reviewId);
    if (!review) throw new NotFoundException('Review khong ton tai');
    return review;
  }
}
