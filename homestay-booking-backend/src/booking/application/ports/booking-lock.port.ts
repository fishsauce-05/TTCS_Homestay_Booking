export const BOOKING_LOCK = Symbol('BOOKING_LOCK');

export interface BookingLockPort {
  withRoomLock<T>(roomId: string, fn: () => Promise<T>): Promise<T>;
}
