import { ConflictException } from '@nestjs/common';

export class RoomAvailabilityPolicy {
  assertNoConflict(hasConflict: boolean): void {
    if (hasConflict) {
      throw new ConflictException('Phong da duoc dat trong khoang thoi gian nay, vui long chon ngay khac');
    }
  }
}
