import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { Amenity } from './entities/amenity.entity';

@Controller('amenity')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createAmenity(@Body() createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    return this.amenityService.createAmenity(createAmenityDto);
  }

  @Get()
  async getAllAmenities(): Promise<Amenity[]> {
    return this.amenityService.getAllAmenities();
  }

  @Get(':id')
  async getAmenityById(@Param('id') id: string): Promise<Amenity> {
    return this.amenityService.getAmenityById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAmenity(
    @Param('id') id: string,
    @Body() updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    return this.amenityService.updateAmenity(id, updateAmenityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteAmenity(@Param('id') id: string): Promise<{ message: string }> {
    return this.amenityService.deleteAmenity(id);
  }
}
