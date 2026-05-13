import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoomDomain } from '../../../domain/room';
import { FindRoomsByHomestayQuery } from './find-rooms-by-homestay.query';
import { ROOM_REPOSITORY } from '../../ports/room-repository.port';
import type { RoomRepositoryPort } from '../../ports/room-repository.port';

@QueryHandler(FindRoomsByHomestayQuery)
export class FindRoomsByHomestayHandler implements IQueryHandler<
  FindRoomsByHomestayQuery,
  RoomDomain[]
> {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly rooms: RoomRepositoryPort,
  ) {}

  execute(query: FindRoomsByHomestayQuery): Promise<RoomDomain[]> {
    return this.rooms.findByHomestay(query.homestayId);
  }
}
