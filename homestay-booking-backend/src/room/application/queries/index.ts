import { FindAvailableRoomsHandler } from './find-available-rooms/find-available-rooms.query-handler';
import { FindFeaturedRoomsHandler } from './find-featured-rooms/find-featured-rooms.query-handler';
import { FindPublicRoomsHandler } from './find-public-rooms/find-public-rooms.query-handler';
import { FindRoomDetailHandler } from './find-room-detail/find-room-detail.query-handler';
import { FindRoomsByHomestayHandler } from './find-rooms-by-homestay/find-rooms-by-homestay.query-handler';
import { SearchRoomsHandler } from './search-rooms/search-rooms.query-handler';

export const RoomQueryHandlers = [
  FindPublicRoomsHandler,
  FindFeaturedRoomsHandler,
  FindRoomsByHomestayHandler,
  FindAvailableRoomsHandler,
  SearchRoomsHandler,
  FindRoomDetailHandler,
];
