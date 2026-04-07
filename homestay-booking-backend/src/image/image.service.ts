import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async createImage(createImageDto: CreateImageDto): Promise<Image> {
    if (!createImageDto.homestayId && !createImageDto.reviewId) {
      throw new BadRequestException('Ảnh phải thuộc homestay hoặc review');
    }

    if (createImageDto.homestayId && createImageDto.reviewId) {
      throw new BadRequestException('Ảnh chỉ được thuộc một loại thực thể');
    }

    const image = this.imageRepository.create(createImageDto);
    return this.imageRepository.save(image);
  }

  async getImagesByHomestay(homestayId: string): Promise<Image[]> {
    return this.imageRepository.find({
      where: { homestayId },
      relations: ['homestay'],
      order: { createdAt: 'DESC' },
    });
  }

  async getImagesByReview(reviewId: string): Promise<Image[]> {
    return this.imageRepository.find({
      where: { reviewId },
      relations: ['review'],
      order: { createdAt: 'DESC' },
    });
  }

  async getImageById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['homestay', 'review'],
    });

    if (!image) {
      throw new NotFoundException('Hình ảnh không tồn tại');
    }

    return image;
  }

  async updateImage(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.getImageById(id);

    Object.assign(image, updateImageDto);
    return this.imageRepository.save(image);
  }

  async deleteImage(id: string): Promise<{ message: string }> {
    const image = await this.getImageById(id);
    await this.imageRepository.remove(image);
    return { message: 'Xóa hình ảnh thành công' };
  }
}
