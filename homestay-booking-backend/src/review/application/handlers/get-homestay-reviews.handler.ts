import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../../entities/review.entity';
import { REVIEW_REPOSITORY } from '../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../ports/review-repository.port';
import { GetHomestayReviewsQuery } from '../queries/get-homestay-reviews.query';

@Injectable()
export class GetHomestayReviewsHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  execute(query: GetHomestayReviewsQuery): Promise<Review[]> {
    return this.reviews.findByHomestay(query.homestayId);
  }
}
