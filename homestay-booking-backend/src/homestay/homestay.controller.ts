import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HomestayService } from './homestay.service';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { SearchHomestayDto } from './dto/search-homestay.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import { Homestay } from './entities/homestay.entity';

@Controller('homestay')
export class HomestayController {
  constructor(private readonly homestayService: HomestayService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async createHomestay(
    @CurrentUser() user: User,
    @Body() createHomestayDto: CreateHomestayDto,
  ): Promise<Homestay> {
    return this.homestayService.createHomestay(user, createHomestayDto);
  }

  @Get()
  async searchHomestays(@Query() searchDto: SearchHomestayDto): Promise<{ data: Homestay[]; total: number }> {
    return this.homestayService.searchHomestays(searchDto);
  }

  @Get('my-homestays')
  @UseGuards(JwtAuthGuard)
  async getMyHomestays(@CurrentUser() user: User): Promise<Homestay[]> {
    return this.homestayService.getMyHomestays(user.id);
  }

  @Get(':id')
  async getHomestayDetail(@Param('id') id: string): Promise<Homestay> {
    return this.homestayService.getHomestayDetail(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateHomestay(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateHomestayDto: UpdateHomestayDto,
  ): Promise<Homestay> {
    return this.homestayService.updateHomestay(id, user, updateHomestayDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Homestay> {
    return this.homestayService.updateStatus(id, user, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteHomestay(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.homestayService.deleteHomestay(id, user);
  }
}
