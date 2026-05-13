import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRoomCommand } from './application/commands/create-room.command';
import { RemoveRoomCommand } from './application/commands/remove-room.command';
import { UpdateRoomCommand } from './application/commands/update-room.command';
import { FindAvailableRoomsQuery } from './application/queries/find-available-rooms.query';
import { FindFeaturedRoomsQuery } from './application/queries/find-featured-rooms.query';
import { FindPublicRoomsQuery } from './application/queries/find-public-rooms.query';
import { FindRoomDetailQuery } from './application/queries/find-room-detail.query';
import { FindRoomsByHomestayQuery } from './application/queries/find-rooms-by-homestay.query';
import { SearchRoomsQuery } from './application/queries/search-rooms.query';
import { PaginatedPublicRooms } from './application/ports/room-repository.port';
import { PublicRoom } from './domain/public-room';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(dto: CreateRoomDto): Promise<Room> {
    return this.commandBus.execute(new CreateRoomCommand(dto));
  }

  findAllPublic(query: Record<string, string>): Promise<PaginatedPublicRooms> {
    return this.queryBus.execute(new FindPublicRoomsQuery(query));
  }

  findFeatured(limit = 6): Promise<PublicRoom[]> {
    return this.queryBus.execute(new FindFeaturedRoomsQuery(limit));
  }

  findByHomestay(homestayId: string): Promise<Room[]> {
    return this.queryBus.execute(new FindRoomsByHomestayQuery(homestayId));
  }

  findOne(id: string): Promise<Room> {
    return this.queryBus.execute(new FindRoomDetailQuery(id, false));
  }

  findOnePublic(id: string): Promise<PublicRoom> {
    return this.queryBus.execute(new FindRoomDetailQuery(id, true));
  }

  update(id: string, dto: UpdateRoomDto): Promise<Room> {
    return this.commandBus.execute(new UpdateRoomCommand(id, dto));
  }

  remove(id: string): Promise<{ message: string }> {
    return this.commandBus.execute(new RemoveRoomCommand(id));
  }

  search(homestayId: string, keyword: string): Promise<Room[]> {
    return this.queryBus.execute(new SearchRoomsQuery(homestayId, keyword));
  }

  findAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    minCapacity: number,
  ): Promise<Room[]> {
    return this.queryBus.execute(
      new FindAvailableRoomsQuery(checkInDate, checkOutDate, minCapacity),
    );
  }
}
