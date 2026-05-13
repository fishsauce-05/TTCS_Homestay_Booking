import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoomDomain } from '../../../domain/room';
import { FindAvailableRoomsQuery } from './find-available-rooms.query';
import { ROOM_REPOSITORY } from '../../ports/room-repository.port';
import type { RoomRepositoryPort } from '../../ports/room-repository.port';

@QueryHandler(FindAvailableRoomsQuery)
export class FindAvailableRoomsHandler implements IQueryHandler<
  FindAvailableRoomsQuery,
  RoomDomain[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindAvailableRoomsQuery): Promise<RoomDomain[]> {
    return this.rooms.findAvailableRooms(
      query.checkInDate,
      query.checkOutDate,
      query.minCapacity,
    );
  }
}
