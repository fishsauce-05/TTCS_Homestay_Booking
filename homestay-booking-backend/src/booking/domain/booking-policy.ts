import { BadRequestException } from '@nestjs/common';

export class BookingPolicy {
  assertValidDateRange(checkInDate: string, checkOutDate: string): void {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) throw new BadRequestException('Ngay check-out phai sau check-in');
  }

  assertCheckInNotPast(checkInDate: string): void {
    const checkIn = new Date(checkInDate);
    if (checkIn < new Date(new Date().toDateString())) {
      throw new BadRequestException('Ngay check-in khong the trong qua khu');
    }
  }

  assertRoomCapacity(capacity: number, guests: number): void {
    if (capacity < guests) {
      throw new BadRequestException(`Phong nay chi chua toi da ${capacity} khach`);
    }
  }
}
