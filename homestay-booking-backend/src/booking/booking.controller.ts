import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('calculate-price')
  async calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.bookingService.calculatePrice(calculatePriceDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingService.createBooking(user.id, createBookingDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@CurrentUser() user: User) {
    return this.bookingService.getMyBookings(user.id);
  }

  @Get('homestay/:homestayId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async getHomestayBookings(@Param('homestayId') homestayId: string) {
    return this.bookingService.getHomestayBookings(homestayId);
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateBookingStatus(id, updateBookingStatusDto);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('id') id: string,
    @Body() body: { cancellationReason: string },
  ) {
    return this.bookingService.cancelBooking(id, body.cancellationReason);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async completeBooking(@Param('id') id: string) {
    return this.bookingService.completeBooking(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
