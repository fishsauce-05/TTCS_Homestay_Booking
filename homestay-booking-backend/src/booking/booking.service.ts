import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '../common/enums';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './entities/booking.entity';
import { CalculatePriceHandler } from './application/handlers/calculate-price.handler';
import { CancelBookingHandler } from './application/handlers/cancel-booking.handler';
import { CompleteBookingHandler } from './application/handlers/complete-booking.handler';
import { ConfirmBookingHandler } from './application/handlers/confirm-booking.handler';
import { CreateBookingHandler } from './application/handlers/create-booking.handler';
import { GetAllBookingsHandler } from './application/handlers/get-all-bookings.handler';
import { GetBookingDetailHandler } from './application/handlers/get-booking-detail.handler';
import { GetMyBookingsHandler } from './application/handlers/get-my-bookings.handler';
import { GetOwnerBookingsHandler } from './application/handlers/get-owner-bookings.handler';
import { GetRoomBookingsHandler } from './application/handlers/get-room-bookings.handler';
import { CalculatePriceQuery } from './application/queries/calculate-price.query';
import { GetAllBookingsQuery } from './application/queries/get-all-bookings.query';
import { GetBookingDetailQuery } from './application/queries/get-booking-detail.query';
import { GetMyBookingsQuery } from './application/queries/get-my-bookings.query';
import { GetOwnerBookingsQuery } from './application/queries/get-owner-bookings.query';
import { GetRoomBookingsQuery } from './application/queries/get-room-bookings.query';
import { CancelBookingCommand } from './application/commands/cancel-booking.command';
import { CompleteBookingCommand } from './application/commands/complete-booking.command';
import { ConfirmBookingCommand } from './application/commands/confirm-booking.command';
import { CreateBookingCommand } from './application/commands/create-booking.command';
import { BOOKING_REPOSITORY } from './application/ports/booking-repository.port';
import { BOOKING_VOUCHER } from './application/ports/voucher.port';
import type { BookingRepositoryPort } from './application/ports/booking-repository.port';
import type { BookingVoucherPort } from './application/ports/voucher.port';

@Injectable()
export class BookingService {
  constructor(
    private readonly calculatePriceHandler: CalculatePriceHandler,
    private readonly createBookingHandler: CreateBookingHandler,
    private readonly getBookingDetailHandler: GetBookingDetailHandler,
    private readonly getMyBookingsHandler: GetMyBookingsHandler,
    private readonly getRoomBookingsHandler: GetRoomBookingsHandler,
    private readonly getOwnerBookingsHandler: GetOwnerBookingsHandler,
    private readonly getAllBookingsHandler: GetAllBookingsHandler,
    private readonly confirmBookingHandler: ConfirmBookingHandler,
    private readonly cancelBookingHandler: CancelBookingHandler,
    private readonly completeBookingHandler: CompleteBookingHandler,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookings: BookingRepositoryPort,
    @Inject(BOOKING_VOUCHER)
    private readonly vouchers: BookingVoucherPort,
  ) {}

  calculatePrice(dto: CalculatePriceDto) {
    return this.calculatePriceHandler.execute(new CalculatePriceQuery(dto));
  }

  createBooking(userId: string, dto: CreateBookingDto): Promise<Booking> {
    return this.createBookingHandler.execute(new CreateBookingCommand(userId, dto));
  }

  getBookingById(id: string): Promise<Booking> {
    return this.getBookingDetailHandler.execute(new GetBookingDetailQuery(id));
  }

  getMyBookings(userId: string): Promise<Booking[]> {
    return this.getMyBookingsHandler.execute(new GetMyBookingsQuery(userId));
  }

  getRoomBookings(roomId: string): Promise<Booking[]> {
    return this.getRoomBookingsHandler.execute(new GetRoomBookingsQuery(roomId));
  }

  getHomestayBookings(homestayId: string): Promise<Booking[]> {
    return this.getOwnerBookingsHandler.execute(new GetOwnerBookingsQuery(homestayId));
  }

  getAllBookings(): Promise<Booking[]> {
    return this.getAllBookingsHandler.execute(new GetAllBookingsQuery());
  }

  confirmBooking(id: string): Promise<Booking> {
    return this.confirmBookingHandler.execute(new ConfirmBookingCommand(id));
  }

  cancelBooking(id: string, cancellationReason: string): Promise<Booking & { penaltyPercent: number }> {
    return this.cancelBookingHandler.execute(new CancelBookingCommand(id, cancellationReason));
  }

  completeBooking(id: string): Promise<Booking> {
    return this.completeBookingHandler.execute(new CompleteBookingCommand(id));
  }

  async updateBookingStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status === BookingStatus.COMPLETED) throw new BadRequestException('Khong the thay doi booking da hoan thanh');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('Khong the thay doi booking da bi huy');
    booking.status = dto.status;
    if (dto.cancellationReason) booking.cancellationReason = dto.cancellationReason;
    return this.bookings.save(booking);
  }

  async deleteBooking(id: string): Promise<{ message: string }> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Chi co the xoa booking dang cho');
    if (booking.voucherId) await this.vouchers.decrementUsage(booking.voucherId);
    await this.bookings.remove(booking);
    return { message: 'Xoa booking thanh cong' };
  }
}
