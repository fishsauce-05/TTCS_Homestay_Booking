import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicRoom } from '../../domain/public-room';
import { FindFeaturedRoomsQuery } from '../queries/find-featured-rooms.query';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(FindFeaturedRoomsQuery)
export class FindFeaturedRoomsHandler implements IQueryHandler<
  FindFeaturedRoomsQuery,
  PublicRoom[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindFeaturedRoomsQuery): Promise<PublicRoom[]> {
    return this.rooms.findFeatured(query.limit);
  }
}
