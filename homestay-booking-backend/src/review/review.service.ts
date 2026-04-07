// src/review/review.service.ts

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Image } from '../image/entities/image.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewReplyDto } from './dto/review-reply.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(homestayId: string, userId: string, createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create({
      homestayId,
      userId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Save images nếu có
    if (createReviewDto.images && createReviewDto.images.length > 0) {
      const images = createReviewDto.images.map((url) => ({
        url,
        reviewId: savedReview.id,
        homestayId: null,
        altText: null,
      }));
      await this.imageRepository.insert(images);
    }

    return this.getReviewById(savedReview.id);
  }

  async getReviewsByHomestay(homestayId: string) {
    return this.reviewRepository.find({
      where: { homestayId },
      relations: ['user', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewById(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'owner', 'images'],
    });

    if (!review) {
      throw new NotFoundException('Review không tồn tại');
    }

    return review;
  }

  async reply(reviewId: string, userId: string, reviewReplyDto: ReviewReplyDto) {
    const review = await this.getReviewById(reviewId);
    
    review.ownerReply = reviewReplyDto.ownerReply;
    review.ownerId = userId;
    review.replyAt = new Date();

    return this.reviewRepository.save(review);
  }

  async deleteReview(id: string, userId: string) {
    const review = await this.getReviewById(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('Không có quyền xóa review này');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review đã xóa' };
  }
}