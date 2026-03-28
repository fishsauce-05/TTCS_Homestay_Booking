import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PriceCalendar } from './entities/price-calendar.entity';
import { CreatePriceCalendarDto } from './dto/create-price-calendar.dto';
import { UpdatePriceCalendarDto } from './dto/update-price-calendar.dto';
import { BulkUpdatePriceCalendarDto } from './dto/bulk-update-price-calendar.dto';

@Injectable()
export class PriceCalendarService {
  constructor(
    @InjectRepository(PriceCalendar)
    private readonly priceCalendarRepository: Repository<PriceCalendar>,
  ) {}

  async createPriceCalendar(createPriceCalendarDto: CreatePriceCalendarDto): Promise<PriceCalendar> {
    const existing = await this.priceCalendarRepository.findOne({
      where: {
        homestayId: createPriceCalendarDto.homestayId,
        date: createPriceCalendarDto.date,
      },
    });

    if (existing) {
      throw new BadRequestException('Ngày này đã có giá rồi');
    }

    const priceCalendar = this.priceCalendarRepository.create({
      ...createPriceCalendarDto,
      isAvailable: createPriceCalendarDto.isAvailable ?? true,
    });
    return this.priceCalendarRepository.save(priceCalendar);
  }

  async getPriceCalendarsByHomestay(homestayId: string): Promise<PriceCalendar[]> {
    return this.priceCalendarRepository.find({
      where: { homestayId },
      relations: ['homestay'],
      order: { date: 'ASC' },
    });
  }

  async getPriceCalendarByDate(homestayId: string, date: string): Promise<PriceCalendar> {
    const priceCalendar = await this.priceCalendarRepository.findOne({
      where: { homestayId, date },
      relations: ['homestay'],
    });

    if (!priceCalendar) {
      throw new NotFoundException('Không tìm thấy giá cho ngày này');
    }

    return priceCalendar;
  }

  async updatePriceCalendar(id: string, updatePriceCalendarDto: UpdatePriceCalendarDto): Promise<PriceCalendar> {
    const priceCalendar = await this.priceCalendarRepository.findOne({ where: { id } });

    if (!priceCalendar) {
      throw new NotFoundException('Giá không tồn tại');
    }

    Object.assign(priceCalendar, updatePriceCalendarDto);
    return this.priceCalendarRepository.save(priceCalendar);
  }

  async deletePriceCalendar(id: string): Promise<{ message: string }> {
    const priceCalendar = await this.priceCalendarRepository.findOne({ where: { id } });

    if (!priceCalendar) {
      throw new NotFoundException('Giá không tồn tại');
    }

    await this.priceCalendarRepository.remove(priceCalendar);
    return { message: 'Xóa giá thành công' };
  }

  async getPriceRange(homestayId: string, startDate: string, endDate: string): Promise<PriceCalendar[]> {
    return this.priceCalendarRepository.find({
      where: {
        homestayId,
        date: Between(startDate, endDate),
      },
      relations: ['homestay'],
      order: { date: 'ASC' },
    });
  }

  async checkAvailability(homestayId: string, startDate: string, endDate: string): Promise<boolean> {
    const priceCalendars = await this.getPriceRange(homestayId, startDate, endDate);

    if (priceCalendars.length === 0) {
      throw new BadRequestException('Không có dữ liệu giá cho khoảng ngày này');
    }

    const hasBlockedDay = priceCalendars.some(pc => !pc.isAvailable);
    return !hasBlockedDay;
  }

  async calculateTotalPrice(homestayId: string, startDate: string, endDate: string): Promise<number> {
    const priceCalendars = await this.getPriceRange(homestayId, startDate, endDate);

    if (priceCalendars.length === 0) {
      throw new BadRequestException('Không có dữ liệu giá cho khoảng ngày này');
    }

    const hasBlockedDay = priceCalendars.some(pc => !pc.isAvailable);
    if (hasBlockedDay) {
      throw new BadRequestException('Có ngày bị block, không thể booking');
    }

    let totalPrice = 0;
    for (const pc of priceCalendars) {
      const finalPrice = pc.price ? Number(pc.price) : Number(pc.homestay.basePrice);
      totalPrice += finalPrice;
    }

    return totalPrice;
  }

  async setAvailability(homestayId: string, startDate: string, endDate: string, isAvailable: boolean): Promise<{ message: string }> {
    const priceCalendars = await this.getPriceRange(homestayId, startDate, endDate);

    if (priceCalendars.length === 0) {
      throw new BadRequestException('Không có dữ liệu giá cho khoảng ngày này');
    }

    await Promise.all(
      priceCalendars.map(pc => {
        pc.isAvailable = isAvailable;
        return this.priceCalendarRepository.save(pc);
      }),
    );

    const action = isAvailable ? 'mở khóa' : 'khóa';
    return { message: `${action} thành công từ ${startDate} đến ${endDate}` };
  }

  async bulkUpdatePriceCalendar(bulkUpdateDto: BulkUpdatePriceCalendarDto): Promise<{ message: string; updatedCount: number }> {
    const priceCalendars = await this.getPriceRange(bulkUpdateDto.homestayId, bulkUpdateDto.startDate, bulkUpdateDto.endDate);

    if (priceCalendars.length === 0) {
      throw new BadRequestException('Không có dữ liệu giá cho khoảng ngày này');
    }

    await Promise.all(
      priceCalendars.map(pc => {
        if (bulkUpdateDto.price !== undefined) {
          pc.price = bulkUpdateDto.price;
        }
        if (bulkUpdateDto.isAvailable !== undefined) {
          pc.isAvailable = bulkUpdateDto.isAvailable;
        }
        return this.priceCalendarRepository.save(pc);
      }),
    );

    return { message: 'Cập nhật thành công', updatedCount: priceCalendars.length };
  }
}