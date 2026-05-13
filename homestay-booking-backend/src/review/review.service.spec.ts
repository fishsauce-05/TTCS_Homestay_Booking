import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { CreateReviewHandler } from './application/handlers/create-review.handler';
import { DeleteReviewHandler } from './application/handlers/delete-review.handler';
import { GetHomestayReviewsHandler } from './application/handlers/get-homestay-reviews.handler';
import { GetReviewDetailHandler } from './application/handlers/get-review-detail.handler';
import { ReplyReviewHandler } from './application/handlers/reply-review.handler';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: CreateReviewHandler, useValue: { execute: jest.fn() } },
        { provide: DeleteReviewHandler, useValue: { execute: jest.fn() } },
        { provide: GetHomestayReviewsHandler, useValue: { execute: jest.fn() } },
        { provide: GetReviewDetailHandler, useValue: { execute: jest.fn() } },
        { provide: ReplyReviewHandler, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
