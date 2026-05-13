import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
  calculatePrice(@Body() dto: CalculatePriceDto) {
    return this.bookingService.calculatePrice(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBooking(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingService.createBooking(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingService.getMyBookings(user.id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get('room/:roomId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  getRoomBookings(@Param('roomId') roomId: string) {
    return this.bookingService.getRoomBookings(roomId);
  }

  @Get('homestay/:homestayId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  getHomestayBookings(@Param('homestayId') homestayId: string) {
    return this.bookingService.getHomestayBookings(homestayId);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelBooking(@Param('id') id: string, @Body() body: { cancellationReason?: string }) {
    return this.bookingService.cancelBooking(id, body.cancellationReason || '');
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  completeBooking(@Param('id') id: string) {
    return this.bookingService.completeBooking(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateBookingStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
