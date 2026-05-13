export class ReviewDomain {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly homestayId: string,
    public rating: number,
    public comment: string,
    public ownerReply: string | null = null,
    public ownerId: string | null = null,
    public replyAt: Date | null = null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly user?: unknown,
    public readonly owner?: unknown,
  ) {}
}
