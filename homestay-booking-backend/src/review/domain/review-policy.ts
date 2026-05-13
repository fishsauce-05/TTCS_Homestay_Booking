import { ForbiddenException } from '@nestjs/common';
import { Review } from '../entities/review.entity';

export class ReviewPolicy {
  assertCanDelete(review: Review, userId: string): void {
    if (review.userId !== userId) {
      throw new ForbiddenException('Khong co quyen xoa review nay');
    }
  }
}
