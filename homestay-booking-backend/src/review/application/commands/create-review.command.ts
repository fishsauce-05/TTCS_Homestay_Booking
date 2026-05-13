import { CreateReviewDto } from '../../dto/create-review.dto';

export class CreateReviewCommand {
  constructor(
    readonly homestayId: string,
    readonly userId: string,
    readonly dto: CreateReviewDto,
  ) {}
}
