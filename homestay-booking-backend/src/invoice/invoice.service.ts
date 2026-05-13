import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Booking } from '../booking/entities/booking.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async createFromBooking(booking: Booking): Promise<Invoice> {
    const existing = await this.invoiceRepo.findOne({ where: { bookingId: booking.id } });
    if (existing) return existing;

    // Load đầy đủ relations — không tin vào booking được truyền vào có sẵn hay không
    const full = await this.bookingRepo.findOne({
      where: { id: booking.id },
      relations: ['user', 'room', 'room.homestay'],
    });
    if (!full) throw new NotFoundException('Booking không tồn tại');
    if (!full.user) throw new InternalServerErrorException(`Booking ${booking.id} thiếu thông tin user`);
    if (!full.room) throw new InternalServerErrorException(`Booking ${booking.id} thiếu thông tin room`);

    const invoice = this.invoiceRepo.create(this.buildCreateInvoiceDto(full));
    return this.invoiceRepo.save(invoice);
  }

  private buildCreateInvoiceDto(booking: Booking): CreateInvoiceDto {
    return {
      bookingId: booking.id,
      customerName: booking.user.fullName,
      roomName: booking.room.name,
      homestayName: booking.room.homestay?.title ?? null,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfNights: booking.numberOfNights,
      pricePerNight: Number(booking.pricePerNight),
      roomPrice: Number(booking.roomPrice),
      discountAmount: Number(booking.discountAmount ?? 0),
      totalAmount: Number(booking.totalPrice),
      penaltyAmount: booking.penaltyAmount ? Number(booking.penaltyAmount) : null,
      refundAmount: booking.refundAmount ? Number(booking.refundAmount) : null,
      invoiceType: 'booking',
      paymentDate: new Date(),
    };
  }

  async getByBookingId(bookingId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { bookingId },
      relations: ['booking', 'booking.user', 'booking.room', 'booking.room.homestay'],
    });
    if (!invoice) throw new NotFoundException('Hóa đơn không tồn tại');
    return invoice;
  }

  async getByUserId(userId: string): Promise<Invoice[]> {
    return this.invoiceRepo
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.booking', 'b', 'b.userId = :userId', { userId })
      .leftJoinAndSelect('b.room', 'room')
      .leftJoinAndSelect('room.homestay', 'homestay')
      .orderBy('inv.createdAt', 'DESC')
      .getMany();
  }

  async getAll(): Promise<Invoice[]> {
    return this.invoiceRepo.find({
      relations: ['booking', 'booking.user', 'booking.room', 'booking.room.homestay'],
      order: { createdAt: 'DESC' },
    });
  }
}
