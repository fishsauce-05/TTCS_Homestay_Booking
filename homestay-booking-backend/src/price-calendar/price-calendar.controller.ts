import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PriceCalendarService } from './price-calendar.service';
import { CreatePriceCalendarDto } from './dto/create-price-calendar.dto';
import { UpdatePriceCalendarDto } from './dto/update-price-calendar.dto';
import { BulkUpdatePriceCalendarDto } from './dto/bulk-update-price-calendar.dto';

@Controller('price-calendars')
export class PriceCalendarController {
  constructor(private readonly priceCalendarService: PriceCalendarService) {}

  @Post()
  async createPriceCalendar(@Body() createPriceCalendarDto: CreatePriceCalendarDto) {
    return this.priceCalendarService.createPriceCalendar(createPriceCalendarDto);
  }

  @Patch('bulk-update')
  async bulkUpdatePriceCalendar(@Body() bulkUpdateDto: BulkUpdatePriceCalendarDto) {
    return this.priceCalendarService.bulkUpdatePriceCalendar(bulkUpdateDto);
  }

  @Patch('set-availability')
  async setAvailability(
    @Body() body: { homestayId: string; startDate: string; endDate: string; isAvailable: boolean },
  ) {
    return this.priceCalendarService.setAvailability(
      body.homestayId,
      body.startDate,
      body.endDate,
      body.isAvailable,
    );
  }

  @Patch(':id')
  async updatePriceCalendar(
    @Param('id') id: string,
    @Body() updatePriceCalendarDto: UpdatePriceCalendarDto,
  ) {
    return this.priceCalendarService.updatePriceCalendar(id, updatePriceCalendarDto);
  }

  @Get('homestay/:homestayId')
  async getPriceCalendarsByHomestay(@Param('homestayId') homestayId: string) {
    return this.priceCalendarService.getPriceCalendarsByHomestay(homestayId);
  }

  @Get(':homestayId/:date')
  async getPriceCalendarByDate(
    @Param('homestayId') homestayId: string,
    @Param('date') date: string,
  ) {
    return this.priceCalendarService.getPriceCalendarByDate(homestayId, date);
  }

  @Get('range')
  async getPriceRange(
    @Query('homestayId') homestayId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.priceCalendarService.getPriceRange(homestayId, startDate, endDate);
  }

  @Get('availability')
  async checkAvailability(
    @Query('homestayId') homestayId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const available = await this.priceCalendarService.checkAvailability(homestayId, startDate, endDate);
    return { available };
  }

  @Get('calculate-price')
  async calculateTotalPrice(
    @Query('homestayId') homestayId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const totalPrice = await this.priceCalendarService.calculateTotalPrice(homestayId, startDate, endDate);
    return { totalPrice };
  }

  @Delete(':id')
  async deletePriceCalendar(@Param('id') id: string) {
    return this.priceCalendarService.deletePriceCalendar(id);
  }
}