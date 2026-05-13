import { CreateBookingDto } from '../../dto/create-booking.dto';

export class CreateBookingCommand {
  constructor(
    readonly userId: string,
    readonly dto: CreateBookingDto,
  ) {}
}
