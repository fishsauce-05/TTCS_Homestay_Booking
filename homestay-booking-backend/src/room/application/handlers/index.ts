import { CreateRoomHandler } from './create-room.handler';
import { FindAvailableRoomsHandler } from './find-available-rooms.handler';
import { FindFeaturedRoomsHandler } from './find-featured-rooms.handler';
import { FindPublicRoomsHandler } from './find-public-rooms.handler';
import { FindRoomDetailHandler } from './find-room-detail.handler';
import { FindRoomsByHomestayHandler } from './find-rooms-by-homestay.handler';
import { RemoveRoomHandler } from './remove-room.handler';
import { SearchRoomsHandler } from './search-rooms.handler';
import { UpdateRoomHandler } from './update-room.handler';

export const RoomCommandHandlers = [
  CreateRoomHandler,
  UpdateRoomHandler,
  RemoveRoomHandler,
];

export const RoomQueryHandlers = [
  FindPublicRoomsHandler,
  FindFeaturedRoomsHandler,
  FindRoomsByHomestayHandler,
  FindAvailableRoomsHandler,
  SearchRoomsHandler,
  FindRoomDetailHandler,
];
