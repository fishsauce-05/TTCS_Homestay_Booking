import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { BookingStatus } from '../common/enums';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  /** Thống kê doanh thu theo homestay trong khoảng ngày — sắp xếp giảm dần tổng doanh thu */
  async revenueByHomestay(startDate: string, endDate: string, ownerId?: string) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.room', 'room')
      .innerJoin('room.homestay', 'hs')
      .where('b.status = :status', { status: BookingStatus.COMPLETED })
      .andWhere('b.checkInDate >= :start', { start: startDate })
      .andWhere('b.checkInDate <= :end', { end: endDate })
      .select('hs.id', 'homestayId')
      .addSelect('hs.title', 'homestayName')
      .addSelect('COUNT(b.id)', 'bookingCount')
      .addSelect('SUM(b.numberOfNights)', 'totalNights')
      .addSelect('SUM(b.totalPrice)', 'totalRevenue')
      .groupBy('hs.id')
      .addGroupBy('hs.title')
      .orderBy('SUM(b.totalPrice)', 'DESC');

    if (ownerId) {
      qb.andWhere('hs.userId = :ownerId', { ownerId });
    }

    return qb.getRawMany();
  }

  /** Thống kê doanh thu theo phòng trong một homestay */
  async revenueByRoom(homestayId: string, startDate: string, endDate: string, ownerId?: string) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.room', 'room', 'room.homestayId = :homestayId', { homestayId })
      .innerJoin('room.homestay', 'hs')
      .where('b.status = :status', { status: BookingStatus.COMPLETED })
      .andWhere('b.checkInDate >= :start', { start: startDate })
      .andWhere('b.checkInDate <= :end', { end: endDate })
      .select('room.id', 'roomId')
      .addSelect('room.name', 'roomName')
      .addSelect('room.roomType', 'roomType')
      .addSelect('SUM(b.numberOfNights)', 'totalNights')
      .addSelect('SUM(b.totalPrice)', 'totalRevenue')
      .groupBy('room.id')
      .addGroupBy('room.name')
      .addGroupBy('room.roomType')
      .orderBy('SUM(b.totalPrice)', 'DESC');

    if (ownerId) {
      qb.andWhere('hs.userId = :ownerId', { ownerId });
    }

    return qb.getRawMany();
  }

  /** Danh sách đơn đặt phòng (hoàn thành) của một phòng — hiển thị trong drill-down */
  async bookingsByRoom(roomId: string, startDate: string, endDate: string, ownerId?: string) {
    const qb = this.bookingRepo
      .createQueryBuilder('b')
      .innerJoinAndSelect('b.user', 'u')
      .innerJoin('b.room', 'room')
      .innerJoin('room.homestay', 'hs')
      .where('b.roomId = :roomId', { roomId })
      .andWhere('b.status = :status', { status: BookingStatus.COMPLETED })
      .andWhere('b.checkInDate >= :start', { start: startDate })
      .andWhere('b.checkInDate <= :end', { end: endDate })
      .select([
        'b.id', 'b.checkInDate', 'b.checkOutDate',
        'b.numberOfNights', 'b.totalPrice', 'b.createdAt',
        'u.fullName',
      ])
      .orderBy('b.checkInDate', 'DESC');

    if (ownerId) {
      qb.andWhere('hs.userId = :ownerId', { ownerId });
    }

    return qb.getMany();
  }

  /** Tổng hợp nhanh cho admin dashboard */
  async platformSummary() {
    const [totalBookings, pendingBookings, totalRevenue] = await Promise.all([
      this.bookingRepo.count(),
      this.bookingRepo.count({ where: { status: BookingStatus.PENDING } }),
      this.bookingRepo
        .createQueryBuilder('b')
        .select('SUM(b.totalPrice)', 'total')
        .where('b.status = :status', { status: BookingStatus.COMPLETED })
        .getRawOne(),
    ]);

    return {
      totalBookings,
      pendingBookings,
      totalRevenue: Number(totalRevenue?.total ?? 0),
    };
  }

  /** Tổng hợp cho owner dashboard */
  async ownerSummary(ownerId: string) {
    const result = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.room', 'room')
      .innerJoin('room.homestay', 'hs', 'hs.userId = :ownerId', { ownerId })
      .select('COUNT(b.id)', 'totalBookings')
      .addSelect('SUM(CASE WHEN b.status = \'completed\' THEN b.totalPrice ELSE 0 END)', 'totalRevenue')
      .addSelect('SUM(CASE WHEN b.status = \'pending\' THEN 1 ELSE 0 END)', 'pendingBookings')
      .getRawOne();

    return {
      totalBookings: Number(result?.totalBookings ?? 0),
      totalRevenue: Number(result?.totalRevenue ?? 0),
      pendingBookings: Number(result?.pendingBookings ?? 0),
    };
  }
}

