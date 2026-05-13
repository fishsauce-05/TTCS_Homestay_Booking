import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewDomain } from '../../../domain/review';
import { Homestay } from '../../../../homestay/entities/homestay.entity';
import { NotificationService } from '../../../../notification/notification.service';
import { CreateReviewCommand } from './create-review.command';
import { REVIEW_REPOSITORY } from '../../ports/review-repository.port';
import type { ReviewRepositoryPort } from '../../ports/review-repository.port';

@Injectable()
export class CreateReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
    @InjectRepository(Homestay)
    private readonly homestayRepo: Repository<Homestay>,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: CreateReviewCommand): Promise<ReviewDomain> {
    const review = this.reviews.create({
      homestayId: command.homestayId,
      userId: command.userId,
      rating: command.dto.rating,
      comment: command.dto.comment,
    });
    const saved = await this.reviews.save(review);
    const homestay = await this.homestayRepo.findOne({
      where: { id: command.homestayId },
    });
    if (homestay) {
      await this.notificationService.create({
        userId: homestay.userId,
        title: 'Có đánh giá mới',
        message: 'Homestay của bạn vừa nhận được một đánh giá mới.',
        type: 'review_new',
        data: {
          reviewId: saved.id,
          homestayId: command.homestayId,
          rating: command.dto.rating,
        },
      });
    }
    return saved;
  }
}
