import { ReviewDomain } from '../../domain/review';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export interface ReviewRepositoryPort {
  create(data: Partial<ReviewDomain>): ReviewDomain;
  save(review: ReviewDomain): Promise<ReviewDomain>;
  remove(review: ReviewDomain): Promise<void>;
  findById(id: string): Promise<ReviewDomain | null>;
  findByHomestay(homestayId: string): Promise<ReviewDomain[]>;
}
