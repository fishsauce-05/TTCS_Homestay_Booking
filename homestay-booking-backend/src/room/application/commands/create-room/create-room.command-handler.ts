import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoomStatus } from '../../../../common/enums';
import { RoomDomain } from '../../../domain/room';
import { CreateRoomCommand } from './create-room.command';
import { ROOM_REPOSITORY } from '../../ports/room-repository.port';
import type { RoomRepositoryPort } from '../../ports/room-repository.port';

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<
  CreateRoomCommand,
  RoomDomain
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(command: CreateRoomCommand): Promise<RoomDomain> {
    const { dto } = command;
    return this.rooms.create({
      homestayId: dto.homestayId,
      name: dto.name,
      roomType: dto.roomType,
      capacity: dto.capacity,
      description: dto.description ?? null,
      basePrice: dto.basePrice,
      images: dto.images ?? [],
      status: RoomStatus.ACTIVE,
      amenityIds: dto.amenityIds,
    });
  }
}
