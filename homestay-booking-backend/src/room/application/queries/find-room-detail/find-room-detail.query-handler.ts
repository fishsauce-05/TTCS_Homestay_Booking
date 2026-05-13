import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicRoom, toPublicRoom } from '../../../domain/public-room';
import { RoomDomain } from '../../../domain/room';
import { FindRoomDetailQuery } from './find-room-detail.query';
import { ROOM_REPOSITORY } from '../../ports/room-repository.port';
import type { RoomRepositoryPort } from '../../ports/room-repository.port';

@QueryHandler(FindRoomDetailQuery)
export class FindRoomDetailHandler implements IQueryHandler<
  FindRoomDetailQuery,
  RoomDomain | PublicRoom
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  async execute(query: FindRoomDetailQuery): Promise<RoomDomain | PublicRoom> {
    const room = await this.rooms.findById(query.id);
    if (!room) throw new NotFoundException('Phong khong ton tai');

    return query.publicView ? toPublicRoom(room) : room;
  }
}
