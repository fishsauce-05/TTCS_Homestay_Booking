import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewRepositoryPort } from '../../application/ports/review-repository.port';
import { Review } from '../../entities/review.entity';

@Injectable()
export class TypeOrmReviewRepository implements ReviewRepositoryPort {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  create(data: Partial<Review>): Review {
    return this.reviewRepo.create(data);
  }

  save(review: Review): Promise<Review> {
    return this.reviewRepo.save(review);
  }

  async remove(review: Review): Promise<void> {
    await this.reviewRepo.remove(review);
  }

  findById(id: string): Promise<Review | null> {
    return this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'owner'],
    });
  }

  findByHomestay(homestayId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { homestayId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
