import { Injectable } from '@nestjs/common';
import { BookingLockPort } from '../../application/ports/booking-lock.port';

@Injectable()
export class NoopBookingLock implements BookingLockPort {
  async withRoomLock<T>(_roomId: string, fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
