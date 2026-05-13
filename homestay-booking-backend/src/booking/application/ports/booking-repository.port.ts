import { BookingDomain } from '../../domain/booking';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface BookingRepositoryPort {
  create(data: Partial<BookingDomain>): BookingDomain;
  save(booking: BookingDomain): Promise<BookingDomain>;
  remove(booking: BookingDomain): Promise<void>;
  findById(id: string): Promise<BookingDomain | null>;
  findByUser(userId: string): Promise<BookingDomain[]>;
  findByRoom(roomId: string): Promise<BookingDomain[]>;
  findByHomestay(homestayId: string): Promise<BookingDomain[]>;
  findAll(): Promise<BookingDomain[]>;
  hasRoomConflict(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    excludeBookingId?: string,
  ): Promise<boolean>;
}
