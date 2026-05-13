import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewDomain } from '../../domain/review';
import { ReviewRepositoryPort } from '../../application/ports/review-repository.port';
import { Review } from '../../entities/review.entity';
import { ReviewMapper } from './review.mapper';

@Injectable()
export class TypeOrmReviewRepository implements ReviewRepositoryPort {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  create(data: Partial<ReviewDomain>): ReviewDomain {
    return new ReviewDomain(
      data.id ?? '',
      data.userId ?? '',
      data.homestayId ?? '',
      data.rating ?? 0,
      data.comment ?? '',
      data.ownerReply ?? null,
      data.ownerId ?? null,
      data.replyAt ?? null,
    );
  }

  async save(review: ReviewDomain): Promise<ReviewDomain> {
    const saved = await this.reviewRepo.save(
      ReviewMapper.toPersistence(review),
    );
    return ReviewMapper.toDomain(saved);
  }

  async remove(review: ReviewDomain): Promise<void> {
    await this.reviewRepo.delete(review.id);
  }

  async findById(id: string): Promise<ReviewDomain | null> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'owner'],
    });
    return review ? ReviewMapper.toDomain(review) : null;
  }

  async findByHomestay(homestayId: string): Promise<ReviewDomain[]> {
    const reviews = await this.reviewRepo.find({
      where: { homestayId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return reviews.map((review) => ReviewMapper.toDomain(review));
  }
}
