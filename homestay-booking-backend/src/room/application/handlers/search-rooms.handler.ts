import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Room } from '../../entities/room.entity';
import { SearchRoomsQuery } from '../queries/search-rooms.query';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(SearchRoomsQuery)
export class SearchRoomsHandler implements IQueryHandler<
  SearchRoomsQuery,
  Room[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: SearchRoomsQuery): Promise<Room[]> {
    return this.rooms.search(query.homestayId, query.keyword);
  }
}
