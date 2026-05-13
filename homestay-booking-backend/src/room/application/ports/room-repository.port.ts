import { Amenity } from '../../../amenity/entities/amenity.entity';
import { Room } from '../../entities/room.entity';
import { PublicRoom } from '../../domain/public-room';

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');

export interface PaginatedPublicRooms {
  data: PublicRoom[];
  total: number;
  page: number;
  limit: number;
}

export interface RoomRepositoryPort {
  create(data: Partial<Room>): Room;
  save(room: Room): Promise<Room>;
  remove(room: Room): Promise<void>;
  resolveAmenities(amenityIds?: string[]): Promise<Amenity[]>;
  findPublic(query: Record<string, string>): Promise<PaginatedPublicRooms>;
  findFeatured(limit?: number): Promise<PublicRoom[]>;
  findByHomestay(homestayId: string): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  search(homestayId: string, keyword: string): Promise<Room[]>;
  findAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    minCapacity: number,
  ): Promise<Room[]>;
  hasActiveFutureBookings(roomId: string, fromDate: string): Promise<boolean>;
}
