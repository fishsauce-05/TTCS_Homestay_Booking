import { UpdateRoomDto } from '../../../dto/update-room.dto';

export class UpdateRoomCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateRoomDto,
  ) {}
}
