import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '../../../common/enums';
import { CalculatePriceDto } from '../../dto/calculate-price.dto';
import { CreateBookingDto } from '../../dto/create-booking.dto';
import { UpdateBookingStatusDto } from '../../dto/update-booking-status.dto';
import { CalculatePriceHandler } from '../queries/calculate-price/calculate-price.query-handler';
import { CancelBookingHandler } from '../commands/cancel-booking/cancel-booking.command-handler';
import { CompleteBookingHandler } from '../commands/complete-booking/complete-booking.command-handler';
import { ConfirmBookingHandler } from '../commands/confirm-booking/confirm-booking.command-handler';
import { CreateBookingHandler } from '../commands/create-booking/create-booking.command-handler';
import { GetAllBookingsHandler } from '../queries/get-all-bookings/get-all-bookings.query-handler';
import { GetBookingDetailHandler } from '../queries/get-booking-detail/get-booking-detail.query-handler';
import { GetMyBookingsHandler } from '../queries/get-my-bookings/get-my-bookings.query-handler';
import { GetOwnerBookingsHandler } from '../queries/get-owner-bookings/get-owner-bookings.query-handler';
import { GetRoomBookingsHandler } from '../queries/get-room-bookings/get-room-bookings.query-handler';
import { CalculatePriceQuery } from '../queries/calculate-price/calculate-price.query';
import { GetAllBookingsQuery } from '../queries/get-all-bookings/get-all-bookings.query';
import { GetBookingDetailQuery } from '../queries/get-booking-detail/get-booking-detail.query';
import { GetMyBookingsQuery } from '../queries/get-my-bookings/get-my-bookings.query';
import { GetOwnerBookingsQuery } from '../queries/get-owner-bookings/get-owner-bookings.query';
import { GetRoomBookingsQuery } from '../queries/get-room-bookings/get-room-bookings.query';
import { CancelBookingCommand } from '../commands/cancel-booking/cancel-booking.command';
import { CompleteBookingCommand } from '../commands/complete-booking/complete-booking.command';
import { ConfirmBookingCommand } from '../commands/confirm-booking/confirm-booking.command';
import { CreateBookingCommand } from '../commands/create-booking/create-booking.command';
import { BOOKING_REPOSITORY } from '../ports/booking-repository.port';
import { BOOKING_VOUCHER } from '../ports/voucher.port';
import { BookingDomain } from '../../domain/booking';
import type { BookingRepositoryPort } from '../ports/booking-repository.port';
import type { BookingVoucherPort } from '../ports/voucher.port';

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

  createBooking(userId: string, dto: CreateBookingDto): Promise<BookingDomain> {
    return this.createBookingHandler.execute(
      new CreateBookingCommand(userId, dto),
    );
  }

  getBookingById(id: string): Promise<BookingDomain> {
    return this.getBookingDetailHandler.execute(new GetBookingDetailQuery(id));
  }

  getMyBookings(userId: string): Promise<BookingDomain[]> {
    return this.getMyBookingsHandler.execute(new GetMyBookingsQuery(userId));
  }

  getRoomBookings(roomId: string): Promise<BookingDomain[]> {
    return this.getRoomBookingsHandler.execute(
      new GetRoomBookingsQuery(roomId),
    );
  }

  getHomestayBookings(homestayId: string): Promise<BookingDomain[]> {
    return this.getOwnerBookingsHandler.execute(
      new GetOwnerBookingsQuery(homestayId),
    );
  }

  getAllBookings(): Promise<BookingDomain[]> {
    return this.getAllBookingsHandler.execute(new GetAllBookingsQuery());
  }

  confirmBooking(id: string): Promise<BookingDomain> {
    return this.confirmBookingHandler.execute(new ConfirmBookingCommand(id));
  }

  cancelBooking(
    id: string,
    cancellationReason: string,
  ): Promise<BookingDomain & { penaltyPercent: number }> {
    return this.cancelBookingHandler.execute(
      new CancelBookingCommand(id, cancellationReason),
    );
  }

  completeBooking(id: string): Promise<BookingDomain> {
    return this.completeBookingHandler.execute(new CompleteBookingCommand(id));
  }

  async updateBookingStatus(
    id: string,
    dto: UpdateBookingStatusDto,
  ): Promise<BookingDomain> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status === BookingStatus.COMPLETED)
      throw new BadRequestException('Khong the thay doi booking da hoan thanh');
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException('Khong the thay doi booking da bi huy');
    booking.status = dto.status;
    if (dto.cancellationReason)
      booking.cancellationReason = dto.cancellationReason;
    return this.bookings.save(booking);
  }

  async deleteBooking(id: string): Promise<{ message: string }> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundException('Booking khong ton tai');
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException('Chi co the xoa booking dang cho');
    if (booking.voucherId)
      await this.vouchers.decrementUsage(booking.voucherId);
    await this.bookings.remove(booking);
    return { message: 'Xoa booking thanh cong' };
  }
}
