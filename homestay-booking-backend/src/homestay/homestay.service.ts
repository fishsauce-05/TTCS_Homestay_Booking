import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Homestay } from './entities/homestay.entity';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { UpdateStatusHomestayDto } from './dto/update-status-homestay.dto';
import { HomestayStatus } from './enums/homestay-status.enum';
import { Amenity } from '../amenity/entities/amenity.entity';

@Injectable()
export class HomestayService {
  constructor(
    @InjectRepository(Homestay)
    private readonly homestayRepository: Repository<Homestay>,
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  private async resolveAmenities(amenityIds?: string[]): Promise<Amenity[]> {
    if (!amenityIds || amenityIds.length === 0) {
      return [];
    }

    const amenities = await this.amenityRepository.find({
      where: { id: In(amenityIds) },
    });

    if (amenities.length !== amenityIds.length) {
      throw new BadRequestException('Một hoặc nhiều amenity không tồn tại');
    }

    return amenities;
  }

  async createHomestay(createHomestayDto: CreateHomestayDto): Promise<Homestay> {
    const { amenityIds, ...payload } = createHomestayDto;
    const amenities = await this.resolveAmenities(amenityIds);

    const homestay = this.homestayRepository.create({
      ...payload,
      status: HomestayStatus.PENDING,
      rejectionReason: null,
      amenities,
    });
    return this.homestayRepository.save(homestay);
  }

  async getAllHomestays(): Promise<Homestay[]> {
    return this.homestayRepository.find({
      relations: ['user', 'amenities', 'images', 'priceCalendars'],
    });
  }

  async getHomestayById(id: string): Promise<Homestay> {
    const homestay = await this.homestayRepository.findOne({
      where: { id },
      relations: ['user', 'amenities', 'images', 'priceCalendars'],
    });

    if (!homestay) {
      throw new NotFoundException('Homestay không tồn tại');
    }

    return homestay;
  }

  async getHomestaysByOwner(userId: string): Promise<Homestay[]> {
    return this.homestayRepository.find({
      where: { userId },
      relations: ['amenities', 'images', 'priceCalendars'],
    });
  }

  async updateHomestay(id: string, updateHomestayDto: UpdateHomestayDto): Promise<Homestay> {
    const homestay = await this.getHomestayById(id);
    const { amenityIds, ...payload } = updateHomestayDto;

    Object.assign(homestay, payload);
    if (amenityIds !== undefined) {
      homestay.amenities = await this.resolveAmenities(amenityIds);
    }

    return this.homestayRepository.save(homestay);
  }

  async updateStatusHomestay(id: string, updateStatusDto: UpdateStatusHomestayDto): Promise<Homestay> {
    const homestay = await this.getHomestayById(id);

    homestay.status = updateStatusDto.status;
    if (updateStatusDto.status === HomestayStatus.REJECTED) {
      homestay.rejectionReason = updateStatusDto.rejectionReason || null;
    } else {
      homestay.rejectionReason = null;
    }

    return this.homestayRepository.save(homestay);
  }

  async deleteHomestay(id: string): Promise<{ message: string }> {
    const homestay = await this.getHomestayById(id);
    await this.homestayRepository.remove(homestay);
    return { message: 'Xóa homestay thành công' };
  }

  async getHomestaysByStatus(status: HomestayStatus): Promise<Homestay[]> {
    return this.homestayRepository.find({
      where: { status },
      relations: ['user', 'amenities', 'images'],
    });
  }

  async searchHomestays(keyword: string): Promise<{ data: Homestay[]; total: number }> {
    const homestays = await this.homestayRepository
      .createQueryBuilder('homestay')
      .where('homestay.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('homestay.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('homestay.address ILIKE :keyword', { keyword: `%${keyword}%` })
      .leftJoinAndSelect('homestay.user', 'user')
      .leftJoinAndSelect('homestay.amenities', 'amenities')
      .leftJoinAndSelect('homestay.images', 'images')
      .orderBy('homestay.createdAt', 'DESC')
      .getMany();

    return { data: homestays, total: homestays.length };
  }
}
