import { Review } from '../../entities/review.entity';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export interface ReviewRepositoryPort {
  create(data: Partial<Review>): Review;
  save(review: Review): Promise<Review>;
  remove(review: Review): Promise<void>;
  findById(id: string): Promise<Review | null>;
  findByHomestay(homestayId: string): Promise<Review[]>;
}
