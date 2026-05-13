import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { HomestayService } from './homestay.service';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { UpdateStatusHomestayDto } from './dto/update-status-homestay.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('homestays')
export class HomestayController {
  constructor(private readonly homestayService: HomestayService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  createHomestay(@Body() dto: CreateHomestayDto, @CurrentUser() user: User) {
    return this.homestayService.createHomestay(user.id, dto);
  }

  @Get('search')
  searchHomestays(@Query('keyword') keyword: string) {
    return this.homestayService.searchHomestays(keyword || '');
  }

  @Get('my-homestays')
  @UseGuards(JwtAuthGuard)
  getMyHomestays(@CurrentUser() user: User) {
    return this.homestayService.getHomestaysByOwner(user.id);
  }

  @Get()
  async getAllHomestays() {
    const homestays = await this.homestayService.getAllHomestays();
    return { data: homestays, total: homestays.length };
  }

  @Get(':id')
  getHomestayById(@Param('id') id: string) {
    return this.homestayService.getHomestayById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  updateHomestay(@Param('id') id: string, @Body() dto: UpdateHomestayDto) {
    return this.homestayService.updateHomestay(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusHomestayDto) {
    return this.homestayService.updateStatusHomestay(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  deleteHomestay(@Param('id') id: string) {
    return this.homestayService.deleteHomestay(id);
  }
}
