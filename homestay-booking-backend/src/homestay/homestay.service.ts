import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homestay, HomestayStatus } from './entities/homestay.entity';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { SearchHomestayDto } from './dto/search-homestay.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class HomestayService {
  constructor(
    @InjectRepository(Homestay)
    private readonly homestayRepository: Repository<Homestay>,
  ) {}

  async createHomestay(user: User, createHomestayDto: CreateHomestayDto): Promise<Homestay> {
    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Chỉ owner hoặc admin mới có thể tạo homestay');
    }

    const homestay = this.homestayRepository.create({
      ...createHomestayDto,
      owner: user,
      ownerId: user.id,
      status: HomestayStatus.PENDING,
    });

    return this.homestayRepository.save(homestay);
  }

  async getHomestayDetail(id: string): Promise<Homestay> {
    const homestay = await this.homestayRepository.findOne({ where: { id } });
    if (!homestay) {
      throw new NotFoundException('Homestay không tồn tại');
    }
    return homestay;
  }

  async searchHomestays(searchDto: SearchHomestayDto): Promise<{ data: Homestay[]; total: number }> {
    const { search, city, district, minPrice, maxPrice, bedrooms, bathrooms, guests, amenities, page = 1, limit = 10 } = searchDto;

    const query = this.homestayRepository.createQueryBuilder('homestay');

    query.where('homestay.status = :status', { status: HomestayStatus.ACTIVE });

    if (search) {
      query.andWhere('(homestay.title ILIKE :search OR homestay.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (city) {
      query.andWhere('homestay.city = :city', { city });
    }

    if (district) {
      query.andWhere('homestay.district = :district', { district });
    }

    if (minPrice && maxPrice) {
      query.andWhere('homestay.pricePerNight BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice) {
      query.andWhere('homestay.pricePerNight >= :minPrice', { minPrice });
    } else if (maxPrice) {
      query.andWhere('homestay.pricePerNight <= :maxPrice', { maxPrice });
    }

    if (bedrooms) {
      query.andWhere('homestay.bedrooms >= :bedrooms', { bedrooms });
    }

    if (bathrooms) {
      query.andWhere('homestay.bathrooms >= :bathrooms', { bathrooms });
    }

    if (guests) {
      query.andWhere('homestay.guests >= :guests', { guests });
    }

    if (amenities && amenities.length > 0) {
      query.andWhere(':amenities && homestay.amenities', { amenities });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async updateHomestay(id: string, user: User, updateHomestayDto: UpdateHomestayDto): Promise<Homestay> {
    const homestay = await this.getHomestayDetail(id);

    if (homestay.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền cập nhật homestay này');
    }

    Object.assign(homestay, updateHomestayDto);

    return this.homestayRepository.save(homestay);
  }

  async updateStatus(id: string, user: User, updateStatusDto: UpdateStatusDto): Promise<Homestay> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Chỉ admin mới có thể cập nhật status');
    }

    const homestay = await this.getHomestayDetail(id);
    homestay.status = updateStatusDto.status;
    homestay.rejectionReason = updateStatusDto.rejectionReason ?? null;

    return this.homestayRepository.save(homestay);
  }

  async deleteHomestay(id: string, user: User): Promise<{ message: string }> {
    const homestay = await this.getHomestayDetail(id);

    if (homestay.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa homestay này');
    }

    await this.homestayRepository.remove(homestay);

    return { message: 'Xóa homestay thành công' };
  }

  async getMyHomestays(userId: string): Promise<Homestay[]> {
    return this.homestayRepository.find({ where: { ownerId: userId } });
  }
}
