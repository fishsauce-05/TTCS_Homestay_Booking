import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async createAmenity(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    const existingAmenity = await this.amenityRepository.findOne({
      where: { name: createAmenityDto.name },
    });

    if (existingAmenity) {
      throw new ConflictException('Amenity này đã tồn tại');
    }

    const amenity = this.amenityRepository.create(createAmenityDto);
    return this.amenityRepository.save(amenity);
  }

  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenityRepository.find();
  }

  async getAmenityById(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new NotFoundException('Amenity không tồn tại');
    }
    return amenity;
  }

  async updateAmenity(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity> {
    const amenity = await this.getAmenityById(id);

    if (updateAmenityDto.name && updateAmenityDto.name !== amenity.name) {
      const existingAmenity = await this.amenityRepository.findOne({
        where: { name: updateAmenityDto.name },
      });
      if (existingAmenity) {
        throw new ConflictException('Tên amenity này đã tồn tại');
      }
    }

    Object.assign(amenity, updateAmenityDto);
    return this.amenityRepository.save(amenity);
  }

  async deleteAmenity(id: string): Promise<{ message: string }> {
    const amenity = await this.getAmenityById(id);
    await this.amenityRepository.remove(amenity);
    return { message: 'Xóa amenity thành công' };
  }
}
