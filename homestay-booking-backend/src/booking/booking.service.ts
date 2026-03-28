import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { PriceCalendarService } from '../price-calendar/price-calendar.service';
import { VoucherService } from '../voucher/voucher.service';
import { HomestayService } from '../homestay/homestay.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly priceCalendarService: PriceCalendarService,
    private readonly voucherService: VoucherService,
    private readonly homestayService: HomestayService,
  ) {}

  async calculatePrice(calculatePriceDto: CalculatePriceDto): Promise<{
    numberOfNights: number;
    roomPrice: number;
    totalPrice: number;
    discountAmount: number;
  }> {
    const { homestayId, checkInDate, checkOutDate, numberOfGuests, voucherId } = calculatePriceDto;

    // Validate homestay exists
    await this.homestayService.getHomestayById(homestayId);

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Ngày check-out phải sau check-in');
    }

    if (numberOfGuests <= 0) {
      throw new BadRequestException('Số lượng khách phải lớn hơn 0');
    }

    // Calculate number of nights
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    const prices = await this.priceCalendarService.getPriceRange(
      homestayId,
      checkInDate,
      checkOutDate,
    );

    if (prices.length === 0) {
      throw new BadRequestException('Không có giá cho ngày đã chọn');
    }

    const totalRoomPrice = prices.reduce((sum, p) => sum + parseFloat(p.price.toString()), 0);
    const roomPrice = totalRoomPrice / numberOfNights;

    let discountAmount = 0;

    if (voucherId) {
      const voucher = await this.voucherService.getVoucherById(voucherId);
      discountAmount = this.voucherService.calculateDiscount(
        voucher.discountValue,
        voucher.type,
        totalRoomPrice,
      );
    }

    const totalPrice = totalRoomPrice - discountAmount;

    return {
      numberOfNights,
      roomPrice,
      totalPrice,
      discountAmount,
    };
  }

  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { homestayId, checkInDate, checkOutDate, numberOfGuests, voucherId } = createBookingDto;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Ngày check-out phải sau check-in');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        homestayId,
        checkInDate: Between(checkInDate, checkOutDate),
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      throw new ConflictException('Homestay đã được đặt trong khoảng thời gian này');
    }

    const priceInfo = await this.calculatePrice(createBookingDto);

    const booking = this.bookingRepository.create({
      userId,
      homestayId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      voucherId: voucherId || null,
      roomPrice: priceInfo.roomPrice,
      discountAmount: priceInfo.discountAmount,
      totalPrice: priceInfo.totalPrice,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    if (voucherId) {
      await this.voucherService.useVoucher(voucherId, savedBooking.id);
    }

    return savedBooking;
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'homestay', 'voucher'],
    });

    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }

    return booking;
  }

  async getMyBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['homestay', 'voucher'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHomestayBookings(homestayId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { homestayId },
      relations: ['user', 'voucher'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBookingStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);

    const { status, cancellationReason } = updateBookingStatusDto;

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Không thể thay đổi booking đã hoàn thành');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Không thể thay đổi booking đã bị hủy');
    }

    if (status === BookingStatus.CANCELLED) {
      booking.cancellationReason = cancellationReason || null;
    }

    booking.status = status;

    return this.bookingRepository.save(booking);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.getBookingById(id);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể confirm booking pending');
    }

    booking.status = BookingStatus.CONFIRMED;
    return this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string, cancellationReason: string): Promise<Booking> {
    const booking = await this.getBookingById(id);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy booking đã hoàn thành');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = cancellationReason || null;

    return this.bookingRepository.save(booking);
  }

  async completeBooking(id: string): Promise<Booking> {
    const booking = await this.getBookingById(id);

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Chỉ có thể complete booking confirmed');
    }

    booking.status = BookingStatus.COMPLETED;
    return this.bookingRepository.save(booking);
  }

  async deleteBooking(id: string): Promise<{ message: string }> {
    const booking = await this.getBookingById(id);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể xóa booking pending');
    }

    await this.bookingRepository.remove(booking);
    return { message: 'Xóa booking thành công' };
  }
}
