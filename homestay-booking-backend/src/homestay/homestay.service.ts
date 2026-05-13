import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homestay } from './entities/homestay.entity';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { UpdateStatusHomestayDto } from './dto/update-status-homestay.dto';
import { HomestayStatus } from '../common/enums';

@Injectable()
export class HomestayService {
  constructor(
    @InjectRepository(Homestay)
    private readonly homestayRepo: Repository<Homestay>,
  ) {}

  async createHomestay(userId: string, dto: CreateHomestayDto): Promise<Homestay> {
    const homestay = this.homestayRepo.create({
      ...dto,
      userId,
      status: HomestayStatus.PENDING,
      rejectionReason: null,
    });
    return this.homestayRepo.save(homestay);
  }

  async getAllHomestays(): Promise<Homestay[]> {
    return this.homestayRepo.find({
      relations: ['user', 'images', 'rooms'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHomestayById(id: string): Promise<Homestay> {
    const homestay = await this.homestayRepo.findOne({
      where: { id },
      relations: ['user', 'images', 'rooms', 'rooms.amenities', 'rooms.pricingSchedules'],
    });
    if (!homestay) throw new NotFoundException('Homestay không tồn tại');
    return homestay;
  }

  async getHomestaysByOwner(userId: string): Promise<Homestay[]> {
    return this.homestayRepo.find({
      where: { userId },
      relations: ['images', 'rooms'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateHomestay(id: string, dto: UpdateHomestayDto): Promise<Homestay> {
    const homestay = await this.getHomestayById(id);
    Object.assign(homestay, dto);
    return this.homestayRepo.save(homestay);
  }

  async updateStatusHomestay(id: string, dto: UpdateStatusHomestayDto): Promise<Homestay> {
    const homestay = await this.getHomestayById(id);
    homestay.status = dto.status;
    if (dto.status === HomestayStatus.REJECTED) {
      homestay.rejectionReason = dto.rejectionReason || null;
    } else {
      homestay.rejectionReason = null;
    }
    return this.homestayRepo.save(homestay);
  }

  async deleteHomestay(id: string): Promise<{ message: string }> {
    const homestay = await this.getHomestayById(id);
    await this.homestayRepo.remove(homestay);
    return { message: 'Xóa homestay thành công' };
  }

  async getHomestaysByStatus(status: HomestayStatus): Promise<Homestay[]> {
    return this.homestayRepo.find({
      where: { status },
      relations: ['user', 'images'],
    });
  }

  async searchHomestays(keyword: string): Promise<{ data: Homestay[]; total: number }> {
    const homestays = await this.homestayRepo
      .createQueryBuilder('h')
      .where('h.title ILIKE :kw', { kw: `%${keyword}%` })
      .orWhere('h.description ILIKE :kw', { kw: `%${keyword}%` })
      .orWhere('h.address ILIKE :kw', { kw: `%${keyword}%` })
      .leftJoinAndSelect('h.user', 'user')
      .leftJoinAndSelect('h.images', 'images')
      .leftJoinAndSelect('h.rooms', 'rooms')
      .orderBy('h.createdAt', 'DESC')
      .getMany();

    return { data: homestays, total: homestays.length };
  }
}
