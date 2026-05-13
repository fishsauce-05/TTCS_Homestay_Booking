import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { PricingSchedule } from './entities/pricing-schedule.entity';
import { CreatePricingScheduleDto } from './dto/create-pricing-schedule.dto';
import { UpdatePricingScheduleDto } from './dto/update-pricing-schedule.dto';
import { Room } from '../room/entities/room.entity';
import { RoomStatus } from '../common/enums';

@Injectable()
export class PricingScheduleService {
  constructor(
    @InjectRepository(PricingSchedule)
    private readonly repo: Repository<PricingSchedule>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  private async checkConflict(roomId: string, startDate: string, endDate: string, excludeId?: string): Promise<void> {
    const qb = this.repo.createQueryBuilder('ps')
      .where('ps.roomId = :roomId', { roomId })
      .andWhere('ps.startDate <= :endDate', { endDate })
      .andWhere('ps.endDate >= :startDate', { startDate });

    if (excludeId) {
      qb.andWhere('ps.id != :excludeId', { excludeId });
    }

    const conflict = await qb.getOne();
    if (conflict) {
      throw new BadRequestException(
        `Khoảng thời gian thiết lập bị trùng với lịch giá đã tồn tại (${conflict.startDate} – ${conflict.endDate}), vui lòng chọn khoảng thời gian khác`,
      );
    }
  }

  async create(dto: CreatePricingScheduleDto): Promise<PricingSchedule> {
    if (dto.startDate >= dto.endDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }
    await this.checkConflict(dto.roomId, dto.startDate, dto.endDate);
    const ps = this.repo.create(dto);
    return this.repo.save(ps);
  }

  async findByRoom(roomId: string): Promise<PricingSchedule[]> {
    return this.repo.find({
      where: { roomId },
      order: { startDate: 'ASC' },
    });
  }

  async findCalendarByRoom(roomId: string, startDate?: string, endDate?: string): Promise<Array<{
    date: string;
    price: number;
    isAvailable: boolean;
    pricingScheduleId: string | null;
  }>> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start);
    if (!endDate) end.setDate(start.getDate() + 30);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      throw new BadRequestException('Khoảng ngày không hợp lệ');
    }

    const startKey = this.toDateString(start);
    const endKey = this.toDateString(end);
    const schedules = await this.repo.createQueryBuilder('ps')
      .where('ps.roomId = :roomId', { roomId })
      .andWhere('ps.startDate <= :endDate', { endDate: endKey })
      .andWhere('ps.endDate >= :startDate', { startDate: startKey })
      .orderBy('ps.startDate', 'ASC')
      .getMany();

    const result: Array<{
      date: string;
      price: number;
      isAvailable: boolean;
      pricingScheduleId: string | null;
    }> = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const date = this.toDateString(cursor);
      const schedule = schedules.find((item) => item.startDate <= date && item.endDate >= date);
      result.push({
        date,
        price: Number(schedule?.pricePerNight ?? room.basePrice),
        isAvailable: room.status === RoomStatus.ACTIVE,
        pricingScheduleId: schedule?.id ?? null,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }

  async findOne(id: string): Promise<PricingSchedule> {
    const ps = await this.repo.findOne({ where: { id }, relations: ['room'] });
    if (!ps) throw new NotFoundException('Lịch giá không tồn tại');
    return ps;
  }

  async update(id: string, dto: UpdatePricingScheduleDto): Promise<PricingSchedule> {
    const ps = await this.findOne(id);
    const startDate = dto.startDate ?? ps.startDate;
    const endDate = dto.endDate ?? ps.endDate;

    if (startDate >= endDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    await this.checkConflict(ps.roomId, startDate, endDate, id);
    Object.assign(ps, dto);
    return this.repo.save(ps);
  }

  async remove(id: string): Promise<{ message: string }> {
    const ps = await this.findOne(id);
    await this.repo.remove(ps);
    return { message: 'Xóa lịch giá thành công' };
  }

  /** Tính tổng tiền cho khoảng ngày checkIn → checkOut (không kể checkOut) */
  async calculateTotalPrice(roomId: string, checkInDate: string, checkOutDate: string): Promise<{ totalPrice: number; pricePerNight: number; numberOfNights: number }> {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) throw new BadRequestException('Khoảng ngày không hợp lệ');

    // Find pricing schedule that covers the entire stay
    const schedule = await this.repo.createQueryBuilder('ps')
      .where('ps.roomId = :roomId', { roomId })
      .andWhere('ps.startDate <= :checkIn', { checkIn: checkInDate })
      .andWhere('ps.endDate >= :checkOut', { checkOut: checkOutDate })
      .getOne();

    if (!schedule) {
      // Try to find any schedule overlapping the range (use the first one)
      const anySchedule = await this.repo.createQueryBuilder('ps')
        .where('ps.roomId = :roomId', { roomId })
        .andWhere('ps.startDate <= :endDate', { endDate: checkOutDate })
        .andWhere('ps.endDate >= :startDate', { startDate: checkInDate })
        .orderBy('ps.startDate', 'ASC')
        .getOne();

      if (!anySchedule) throw new BadRequestException('Không có lịch giá cho khoảng ngày đã chọn. Vui lòng liên hệ chủ homestay.');

      const pricePerNight = Number(anySchedule.pricePerNight);
      return { totalPrice: pricePerNight * numberOfNights, pricePerNight, numberOfNights };
    }

    const pricePerNight = Number(schedule.pricePerNight);
    return { totalPrice: pricePerNight * numberOfNights, pricePerNight, numberOfNights };
  }

  /** Kiểm tra xem phòng có lịch giá cho khoảng ngày không */
  async hasPricingForRange(roomId: string, checkInDate: string, checkOutDate: string): Promise<boolean> {
    const schedule = await this.repo.createQueryBuilder('ps')
      .where('ps.roomId = :roomId', { roomId })
      .andWhere('ps.startDate <= :endDate', { endDate: checkOutDate })
      .andWhere('ps.endDate >= :startDate', { startDate: checkInDate })
      .getOne();
    return !!schedule;
  }

  private toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
