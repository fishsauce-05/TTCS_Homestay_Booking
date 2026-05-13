import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewDomain } from '../../../domain/review';
import { NotificationService } from '../../../../notification/notification.service';
import { ReplyReviewCommand } from './reply-review.command';
import { REVIEW_REPOSITORY } from '../../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../../ports/review-repository.port';

@Injectable()
export class ReplyReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: ReplyReviewCommand): Promise<ReviewDomain> {
    const review = await this.reviews.findById(command.reviewId);
    if (!review) throw new NotFoundException('Review không tồn tại');
    review.ownerReply = command.dto.ownerReply;
    review.ownerId = command.ownerId;
    review.replyAt = new Date();
    const saved = await this.reviews.save(review);
    await this.notificationService.create({
      userId: review.userId,
      title: 'Chủ nhà đã phản hồi đánh giá',
      message: 'Chủ nhà đã phản hồi đánh giá của bạn.',
      type: 'review_replied',
      data: { reviewId: saved.id },
    });
    return saved;
  }
}
