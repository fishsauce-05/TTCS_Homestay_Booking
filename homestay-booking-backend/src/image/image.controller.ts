import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async createImage(@Body() createImageDto: CreateImageDto) {
    return this.imageService.createImage(createImageDto);
  }

  @Get('homestay/:homestayId')
  async getImagesByHomestay(@Param('homestayId') homestayId: string) {
    return this.imageService.getImagesByHomestay(homestayId);
  }

  @Get('review/:reviewId')
  async getImagesByReview(@Param('reviewId') reviewId: string) {
    return this.imageService.getImagesByReview(reviewId);
  }

  @Get(':id')
  async getImageById(@Param('id') id: string) {
    return this.imageService.getImageById(id);
  }

  @Patch(':id')
  async updateImage(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.updateImage(id, updateImageDto);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    return this.imageService.deleteImage(id);
  }
}
