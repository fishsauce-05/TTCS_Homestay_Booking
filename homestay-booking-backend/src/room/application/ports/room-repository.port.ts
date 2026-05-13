import { RoomStatus } from '../../../common/enums';
import { PublicRoom } from '../../domain/public-room';
import { RoomDomain } from '../../domain/room';

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');

export interface PaginatedPublicRooms {
  data: PublicRoom[];
  total: number;
  page: number;
  limit: number;
}

export interface SaveRoomData {
  homestayId: string;
  name: string;
  roomType: string;
  capacity: number;
  description: string | null;
  basePrice: number;
  images: string[];
  status: RoomStatus;
  amenityIds?: string[];
}

export interface RoomRepositoryPort {
  create(data: SaveRoomData): Promise<RoomDomain>;
  save(room: RoomDomain, amenityIds?: string[]): Promise<RoomDomain>;
  remove(room: RoomDomain): Promise<void>;
  findPublic(query: Record<string, string>): Promise<PaginatedPublicRooms>;
  findFeatured(limit?: number): Promise<PublicRoom[]>;
  findByHomestay(homestayId: string): Promise<RoomDomain[]>;
  findById(id: string): Promise<RoomDomain | null>;
  search(homestayId: string, keyword: string): Promise<RoomDomain[]>;
  findAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    minCapacity: number,
  ): Promise<RoomDomain[]>;
  hasActiveFutureBookings(roomId: string, fromDate: string): Promise<boolean>;
}
