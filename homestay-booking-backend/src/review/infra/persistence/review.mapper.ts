import { ReviewDomain } from '../../domain/review';
import { Review } from '../../entities/review.entity';

export class ReviewMapper {
  static toDomain(entity: Review): ReviewDomain {
    return new ReviewDomain(
      entity.id,
      entity.userId,
      entity.homestayId,
      entity.rating,
      entity.comment,
      entity.ownerReply,
      entity.ownerId,
      entity.replyAt,
      entity.createdAt,
      entity.updatedAt,
      entity.user,
      entity.owner,
    );
  }

  static toPersistence(domain: ReviewDomain): Partial<Review> {
    return {
      id: domain.id || undefined,
      userId: domain.userId,
      homestayId: domain.homestayId,
      rating: domain.rating,
      comment: domain.comment,
      ownerReply: domain.ownerReply ?? undefined,
      ownerId: domain.ownerId ?? undefined,
      replyAt: domain.replyAt ?? undefined,
    };
  }
}
