import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from '../../../common/enums';
import { BookingRepositoryPort } from '../../application/ports/booking-repository.port';
import { Booking } from '../../entities/booking.entity';

@Injectable()
export class TypeOrmBookingRepository implements BookingRepositoryPort {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  create(data: Partial<Booking>): Booking {
    return this.bookingRepo.create(data);
  }

  save(booking: Booking): Promise<Booking> {
    return this.bookingRepo.save(booking);
  }

  async remove(booking: Booking): Promise<void> {
    await this.bookingRepo.remove(booking);
  }

  findById(id: string): Promise<Booking | null> {
    return this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'room', 'room.homestay'],
    });
  }

  findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      relations: ['room', 'room.homestay'],
      order: { createdAt: 'DESC' },
    });
  }

  findByRoom(roomId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { roomId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findByHomestay(homestayId: string): Promise<Booking[]> {
    return this.bookingRepo.createQueryBuilder('b')
      .innerJoinAndSelect('b.room', 'room', 'room.homestayId = :homestayId', { homestayId })
      .leftJoinAndSelect('b.user', 'user')
      .orderBy('b.createdAt', 'DESC')
      .getMany();
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['user', 'room', 'room.homestay'],
      order: { createdAt: 'DESC' },
    });
  }

  async hasRoomConflict(roomId: string, checkInDate: string, checkOutDate: string, excludeBookingId?: string): Promise<boolean> {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .where('b.roomId = :roomId', { roomId })
      .andWhere('b.status IN (:...statuses)', { statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING] })
      .andWhere('b.checkInDate < :checkOut', { checkOut: checkOutDate })
      .andWhere('b.checkOutDate > :checkIn', { checkIn: checkInDate });

    if (excludeBookingId) qb.andWhere('b.id != :excludeBookingId', { excludeBookingId });
    return !!(await qb.getOne());
  }
}
