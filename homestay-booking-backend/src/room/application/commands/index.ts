import { CreateRoomHandler } from './create-room/create-room.command-handler';
import { RemoveRoomHandler } from './remove-room/remove-room.command-handler';
import { UpdateRoomHandler } from './update-room/update-room.command-handler';

export const RoomCommandHandlers = [
  CreateRoomHandler,
  UpdateRoomHandler,
  RemoveRoomHandler,
];
