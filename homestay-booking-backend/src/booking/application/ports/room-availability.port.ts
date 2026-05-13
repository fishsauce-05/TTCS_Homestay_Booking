export const ROOM_AVAILABILITY = Symbol('ROOM_AVAILABILITY');

export interface RoomAvailabilityPort {
  getRoom(roomId: string): Promise<{ id: string; capacity: number }>;
  hasConflict(roomId: string, checkInDate: string, checkOutDate: string, excludeBookingId?: string): Promise<boolean>;
}
