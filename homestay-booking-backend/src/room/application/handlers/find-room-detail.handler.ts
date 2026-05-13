import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicRoom, toPublicRoom } from '../../domain/public-room';
import { Room } from '../../entities/room.entity';
import { FindRoomDetailQuery } from '../queries/find-room-detail.query';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(FindRoomDetailQuery)
export class FindRoomDetailHandler implements IQueryHandler<
  FindRoomDetailQuery,
  Room | PublicRoom
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  async execute(query: FindRoomDetailQuery): Promise<Room | PublicRoom> {
    const room = await this.rooms.findById(query.id);
    if (!room) throw new NotFoundException('Phong khong ton tai');

    return query.publicView ? toPublicRoom(room) : room;
  }
}
