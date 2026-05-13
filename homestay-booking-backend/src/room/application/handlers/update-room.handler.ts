import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Room } from '../../entities/room.entity';
import { UpdateRoomCommand } from '../commands/update-room.command';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@CommandHandler(UpdateRoomCommand)
export class UpdateRoomHandler implements ICommandHandler<
  UpdateRoomCommand,
  Room
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  async execute(command: UpdateRoomCommand): Promise<Room> {
    const room = await this.rooms.findById(command.id);
    if (!room) throw new NotFoundException('Phong khong ton tai');

    const now = new Date().toISOString().split('T')[0];
    const hasActiveFutureBookings = await this.rooms.hasActiveFutureBookings(
      command.id,
      now,
    );
    if (
      hasActiveFutureBookings &&
      (command.dto.capacity !== undefined || command.dto.roomType !== undefined)
    ) {
      throw new BadRequestException(
        'Khong the thay doi thong tin phong khi dang co dat phong dang hoat dong',
      );
    }

    const { amenityIds, ...payload } = command.dto;
    Object.assign(room, payload);

    if (amenityIds !== undefined) {
      room.amenities = await this.rooms.resolveAmenities(amenityIds);
    }

    return this.rooms.save(room);
  }
}
