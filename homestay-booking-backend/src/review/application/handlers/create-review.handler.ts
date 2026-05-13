import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../../entities/review.entity';
import { CreateReviewCommand } from '../commands/create-review.command';
import { REVIEW_REPOSITORY } from '../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../ports/review-repository.port';

@Injectable()
export class CreateReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
  ) {}

  execute(command: CreateReviewCommand): Promise<Review> {
    const review = this.reviews.create({
      homestayId: command.homestayId,
      userId: command.userId,
      rating: command.dto.rating,
      comment: command.dto.comment,
    });
    return this.reviews.save(review);
  }
}
