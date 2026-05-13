import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Room } from '../../entities/room.entity';
import { FindRoomsByHomestayQuery } from '../queries/find-rooms-by-homestay.query';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(FindRoomsByHomestayQuery)
export class FindRoomsByHomestayHandler implements IQueryHandler<
  FindRoomsByHomestayQuery,
  Room[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindRoomsByHomestayQuery): Promise<Room[]> {
    return this.rooms.findByHomestay(query.homestayId);
  }
}
