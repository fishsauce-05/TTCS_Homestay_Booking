import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRoomCommand } from '../commands/create-room/create-room.command';
import { RemoveRoomCommand } from '../commands/remove-room/remove-room.command';
import { UpdateRoomCommand } from '../commands/update-room/update-room.command';
import { FindAvailableRoomsQuery } from '../queries/find-available-rooms/find-available-rooms.query';
import { FindFeaturedRoomsQuery } from '../queries/find-featured-rooms/find-featured-rooms.query';
import { FindPublicRoomsQuery } from '../queries/find-public-rooms/find-public-rooms.query';
import { FindRoomDetailQuery } from '../queries/find-room-detail/find-room-detail.query';
import { FindRoomsByHomestayQuery } from '../queries/find-rooms-by-homestay/find-rooms-by-homestay.query';
import { SearchRoomsQuery } from '../queries/search-rooms/search-rooms.query';
import { PaginatedPublicRooms } from '../ports/room-repository.port';
import { PublicRoom } from '../../domain/public-room';
import { RoomDomain } from '../../domain/room';
import { CreateRoomDto } from '../../dto/create-room.dto';
import { UpdateRoomDto } from '../../dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(dto: CreateRoomDto): Promise<RoomDomain> {
    return this.commandBus.execute(new CreateRoomCommand(dto));
  }

  findAllPublic(query: Record<string, string>): Promise<PaginatedPublicRooms> {
    return this.queryBus.execute(new FindPublicRoomsQuery(query));
  }

  findFeatured(limit = 6): Promise<PublicRoom[]> {
    return this.queryBus.execute(new FindFeaturedRoomsQuery(limit));
  }

  findByHomestay(homestayId: string): Promise<RoomDomain[]> {
    return this.queryBus.execute(new FindRoomsByHomestayQuery(homestayId));
  }

  findOne(id: string): Promise<RoomDomain> {
    return this.queryBus.execute(new FindRoomDetailQuery(id, false));
  }

  findOnePublic(id: string): Promise<PublicRoom> {
    return this.queryBus.execute(new FindRoomDetailQuery(id, true));
  }

  update(id: string, dto: UpdateRoomDto): Promise<RoomDomain> {
    return this.commandBus.execute(new UpdateRoomCommand(id, dto));
  }

  remove(id: string): Promise<{ message: string }> {
    return this.commandBus.execute(new RemoveRoomCommand(id));
  }

  search(homestayId: string, keyword: string): Promise<RoomDomain[]> {
    return this.queryBus.execute(new SearchRoomsQuery(homestayId, keyword));
  }

  findAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    minCapacity: number,
  ): Promise<RoomDomain[]> {
    return this.queryBus.execute(
      new FindAvailableRoomsQuery(checkInDate, checkOutDate, minCapacity),
    );
  }
}
