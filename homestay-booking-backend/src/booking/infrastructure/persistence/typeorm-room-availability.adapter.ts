import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../application/ports/booking-repository.port';
import { RoomAvailabilityPort } from '../../application/ports/room-availability.port';
import { RoomService } from '../../../room/room.service';
import type { BookingRepositoryPort } from '../../application/ports/booking-repository.port';

@Injectable()
export class TypeOrmRoomAvailabilityAdapter implements RoomAvailabilityPort {
  constructor(
    private readonly roomService: RoomService,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
  ) {}

  async getRoom(roomId: string): Promise<{ id: string; capacity: number }> {
    const room = await this.roomService.findOne(roomId);
    return { id: room.id, capacity: room.capacity };
  }

  hasConflict(roomId: string, checkInDate: string, checkOutDate: string, excludeBookingId?: string): Promise<boolean> {
    return this.bookings.hasRoomConflict(roomId, checkInDate, checkOutDate, excludeBookingId);
  }
}
