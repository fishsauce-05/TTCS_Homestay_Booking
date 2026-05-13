import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RoomStatus } from '../../../common/enums';
import { Room } from '../../entities/room.entity';
import { CreateRoomCommand } from '../commands/create-room.command';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<
  CreateRoomCommand,
  Room
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  async execute(command: CreateRoomCommand): Promise<Room> {
    const { dto } = command;
    const amenities = await this.rooms.resolveAmenities(dto.amenityIds);
    const room = this.rooms.create({
      homestayId: dto.homestayId,
      name: dto.name,
      roomType: dto.roomType,
      capacity: dto.capacity,
      description: dto.description ?? null,
      basePrice: dto.basePrice,
      images: dto.images ?? [],
      status: RoomStatus.ACTIVE,
      amenities,
    });

    return this.rooms.save(room);
  }
}
