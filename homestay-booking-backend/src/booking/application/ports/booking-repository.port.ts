import { Booking } from '../../entities/booking.entity';

export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface BookingRepositoryPort {
  create(data: Partial<Booking>): Booking;
  save(booking: Booking): Promise<Booking>;
  remove(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findByUser(userId: string): Promise<Booking[]>;
  findByRoom(roomId: string): Promise<Booking[]>;
  findByHomestay(homestayId: string): Promise<Booking[]>;
  findAll(): Promise<Booking[]>;
  hasRoomConflict(roomId: string, checkInDate: string, checkOutDate: string, excludeBookingId?: string): Promise<boolean>;
}
