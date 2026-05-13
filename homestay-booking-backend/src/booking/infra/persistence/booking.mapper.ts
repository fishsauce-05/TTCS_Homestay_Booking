import { BookingDomain } from '../../domain/booking';
import { Booking } from '../../entities/booking.entity';

export class BookingMapper {
  static toDomain(entity: Booking): BookingDomain {
    return new BookingDomain(
      entity.id,
      entity.userId,
      entity.roomId,
      entity.checkInDate,
      entity.checkOutDate,
      entity.numberOfNights,
      entity.numberOfGuests,
      Number(entity.pricePerNight),
      Number(entity.roomPrice),
      Number(entity.discountAmount),
      Number(entity.totalPrice),
      entity.voucherId,
      entity.penaltyAmount === null ? null : Number(entity.penaltyAmount),
      entity.refundAmount === null ? null : Number(entity.refundAmount),
      entity.status,
      entity.cancellationReason,
      entity.createdAt,
      entity.updatedAt,
      entity.user,
      entity.room,
    );
  }

  static toPersistence(domain: BookingDomain): Partial<Booking> {
    return {
      id: domain.id || undefined,
      userId: domain.userId,
      roomId: domain.roomId,
      checkInDate: domain.checkInDate,
      checkOutDate: domain.checkOutDate,
      numberOfNights: domain.numberOfNights,
      numberOfGuests: domain.numberOfGuests,
      pricePerNight: domain.pricePerNight,
      roomPrice: domain.roomPrice,
      discountAmount: domain.discountAmount,
      totalPrice: domain.totalPrice,
      voucherId: domain.voucherId,
      penaltyAmount: domain.penaltyAmount,
      refundAmount: domain.refundAmount,
      status: domain.status,
      cancellationReason: domain.cancellationReason,
    };
  }
}
