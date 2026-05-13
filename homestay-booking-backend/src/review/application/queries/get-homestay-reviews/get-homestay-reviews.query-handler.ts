import { Inject, Injectable } from '@nestjs/common';
import { ReviewDomain } from '../../../domain/review';
import { REVIEW_REPOSITORY } from '../../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../../ports/review-repository.port';
import { GetHomestayReviewsQuery } from './get-homestay-reviews.query';

@Injectable()
export class GetHomestayReviewsHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  execute(query: GetHomestayReviewsQuery): Promise<ReviewDomain[]> {
    return this.reviews.findByHomestay(query.homestayId);
  }
}
