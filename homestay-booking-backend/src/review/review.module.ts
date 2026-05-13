import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Homestay } from '../homestay/entities/homestay.entity';
import { NotificationModule } from '../notification/notification.module';
import { ReviewService } from './review.service';
import { ReviewController } from './presenters/http/review.controller';
import { CreateReviewHandler } from './application/commands/create-review/create-review.command-handler';
import { DeleteReviewHandler } from './application/commands/delete-review/delete-review.command-handler';
import { GetHomestayReviewsHandler } from './application/queries/get-homestay-reviews/get-homestay-reviews.query-handler';
import { GetReviewDetailHandler } from './application/queries/get-review-detail/get-review-detail.query-handler';
import { ReplyReviewHandler } from './application/commands/reply-review/reply-review.command-handler';
import { REVIEW_REPOSITORY } from './application/ports/review-repository.port';
import { TypeOrmReviewRepository } from './infra/persistence/typeorm-review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Homestay]), NotificationModule],
  providers: [
    ReviewService,
    CreateReviewHandler,
    DeleteReviewHandler,
    GetHomestayReviewsHandler,
    GetReviewDetailHandler,
    ReplyReviewHandler,
    TypeOrmReviewRepository,
    { provide: REVIEW_REPOSITORY, useExisting: TypeOrmReviewRepository },
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
