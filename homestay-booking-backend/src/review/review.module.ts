import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './presentation/review.controller';
import { CreateReviewHandler } from './application/handlers/create-review.handler';
import { DeleteReviewHandler } from './application/handlers/delete-review.handler';
import { GetHomestayReviewsHandler } from './application/handlers/get-homestay-reviews.handler';
import { GetReviewDetailHandler } from './application/handlers/get-review-detail.handler';
import { ReplyReviewHandler } from './application/handlers/reply-review.handler';
import { REVIEW_REPOSITORY } from './application/ports/review-repository.port';
import { TypeOrmReviewRepository } from './infrastructure/persistence/typeorm-review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
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
