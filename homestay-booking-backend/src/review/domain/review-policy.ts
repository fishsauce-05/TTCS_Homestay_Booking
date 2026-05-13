import { ForbiddenException } from '@nestjs/common';
import { ReviewDomain } from './review';

export class ReviewPolicy {
  assertCanDelete(review: ReviewDomain, userId: string): void {
    if (review.userId !== userId) {
      throw new ForbiddenException('Khong the xoa review nay');
    }
  }
}
