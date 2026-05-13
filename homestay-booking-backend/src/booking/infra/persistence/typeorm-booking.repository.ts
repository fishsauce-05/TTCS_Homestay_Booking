import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from '../../../common/enums';
import { BookingRepositoryPort } from '../../application/ports/booking-repository.port';
import { BookingDomain } from '../../domain/booking';
import { Booking } from '../../entities/booking.entity';
import { BookingMapper } from './booking.mapper';

@Injectable()
export class TypeOrmBookingRepository implements BookingRepositoryPort {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  create(data: Partial<BookingDomain>): BookingDomain {
    return new BookingDomain(
      data.id ?? '',
      data.userId ?? '',
      data.roomId ?? '',
      data.checkInDate ?? '',
      data.checkOutDate ?? '',
      data.numberOfNights ?? 0,
      data.numberOfGuests ?? 0,
      data.pricePerNight ?? 0,
      data.roomPrice ?? 0,
      data.discountAmount ?? 0,
      data.totalPrice ?? 0,
      data.voucherId ?? null,
      data.penaltyAmount ?? null,
      data.refundAmount ?? null,
      data.status ?? BookingStatus.PENDING,
      data.cancellationReason ?? null,
    );
  }

  async save(booking: BookingDomain): Promise<BookingDomain> {
    const saved = await this.bookingRepo.save(
      BookingMapper.toPersistence(booking),
    );
    return BookingMapper.toDomain(saved);
  }

  async remove(booking: BookingDomain): Promise<void> {
    await this.bookingRepo.delete(booking.id);
  }

  async findById(id: string): Promise<BookingDomain | null> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'room', 'room.homestay'],
    });
    return booking ? BookingMapper.toDomain(booking) : null;
  }

  async findByUser(userId: string): Promise<BookingDomain[]> {
    const bookings = await this.bookingRepo.find({
      where: { userId },
      relations: ['room', 'room.homestay'],
      order: { createdAt: 'DESC' },
    });
    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async findByRoom(roomId: string): Promise<BookingDomain[]> {
    const bookings = await this.bookingRepo.find({
      where: { roomId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async findByHomestay(homestayId: string): Promise<BookingDomain[]> {
    const bookings = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoinAndSelect('b.room', 'room', 'room.homestayId = :homestayId', {
        homestayId,
      })
      .leftJoinAndSelect('b.user', 'user')
      .orderBy('b.createdAt', 'DESC')
      .getMany();
    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async findAll(): Promise<BookingDomain[]> {
    const bookings = await this.bookingRepo.find({
      relations: ['user', 'room', 'room.homestay'],
      order: { createdAt: 'DESC' },
    });
    return bookings.map((booking) => BookingMapper.toDomain(booking));
  }

  async hasRoomConflict(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .where('b.roomId = :roomId', { roomId })
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      })
      .andWhere('b.checkInDate < :checkOut', { checkOut: checkOutDate })
      .andWhere('b.checkOutDate > :checkIn', { checkIn: checkInDate });

    if (excludeBookingId) {
      qb.andWhere('b.id != :excludeBookingId', { excludeBookingId });
    }
    return !!(await qb.getOne());
  }
}
