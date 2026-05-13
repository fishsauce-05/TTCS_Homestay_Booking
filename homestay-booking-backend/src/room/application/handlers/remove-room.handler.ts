import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveRoomCommand } from '../commands/remove-room.command';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@CommandHandler(RemoveRoomCommand)
export class RemoveRoomHandler implements ICommandHandler<
  RemoveRoomCommand,
  { message: string }
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  async execute(command: RemoveRoomCommand): Promise<{ message: string }> {
    const room = await this.rooms.findById(command.id);
    if (!room) throw new NotFoundException('Phong khong ton tai');

    const now = new Date().toISOString().split('T')[0];
    if (await this.rooms.hasActiveFutureBookings(command.id, now)) {
      throw new BadRequestException(
        'Khong the xoa phong khi dang co dat phong trong tuong lai',
      );
    }

    await this.rooms.remove(room);
    return { message: 'Xoa phong thanh cong' };
  }
}
