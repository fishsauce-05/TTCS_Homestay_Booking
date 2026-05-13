import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPublicRoomsQuery } from '../queries/find-public-rooms.query';
import {
  ROOM_REPOSITORY,
  PaginatedPublicRooms,
} from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(FindPublicRoomsQuery)
export class FindPublicRoomsHandler implements IQueryHandler<
  FindPublicRoomsQuery,
  PaginatedPublicRooms
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindPublicRoomsQuery): Promise<PaginatedPublicRooms> {
    return this.rooms.findPublic(query.query);
  }
}
