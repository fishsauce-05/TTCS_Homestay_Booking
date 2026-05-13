import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Room } from '../../entities/room.entity';
import { FindAvailableRoomsQuery } from '../queries/find-available-rooms.query';
import { ROOM_REPOSITORY } from '../ports/room-repository.port';
import type { RoomRepositoryPort } from '../ports/room-repository.port';

@QueryHandler(FindAvailableRoomsQuery)
export class FindAvailableRoomsHandler implements IQueryHandler<
  FindAvailableRoomsQuery,
  Room[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindAvailableRoomsQuery): Promise<Room[]> {
    return this.rooms.findAvailableRooms(
      query.checkInDate,
      query.checkOutDate,
      query.minCapacity,
    );
  }
}
