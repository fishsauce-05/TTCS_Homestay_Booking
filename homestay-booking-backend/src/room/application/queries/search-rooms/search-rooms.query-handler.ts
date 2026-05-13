import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoomDomain } from '../../../domain/room';
import { SearchRoomsQuery } from './search-rooms.query';
import { ROOM_REPOSITORY } from '../../ports/room-repository.port';
import type { RoomRepositoryPort } from '../../ports/room-repository.port';

@QueryHandler(SearchRoomsQuery)
export class SearchRoomsHandler implements IQueryHandler<
  SearchRoomsQuery,
  RoomDomain[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: SearchRoomsQuery): Promise<RoomDomain[]> {
    return this.rooms.search(query.homestayId, query.keyword);
  }
}
