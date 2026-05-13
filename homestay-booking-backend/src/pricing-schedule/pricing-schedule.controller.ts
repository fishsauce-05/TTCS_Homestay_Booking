import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PricingScheduleService } from './pricing-schedule.service';
import { CreatePricingScheduleDto } from './dto/create-pricing-schedule.dto';
import { UpdatePricingScheduleDto } from './dto/update-pricing-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pricing-schedules')
export class PricingScheduleController {
  constructor(private readonly service: PricingScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  create(@Body() dto: CreatePricingScheduleDto) {
    return this.service.create(dto);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    return this.service.findByRoom(roomId);
  }

  @Get('room/:roomId/calendar')
  findCalendarByRoom(
    @Param('roomId') roomId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findCalendarByRoom(roomId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdatePricingScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

