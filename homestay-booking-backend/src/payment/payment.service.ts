import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Booking } from '../booking/entities/booking.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { PriceCalendar } from '../price-calendar/entities/price-calendar.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(PriceCalendar)
    private readonly priceCalendarRepository: Repository<PriceCalendar>,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<Payment> {
    // ✅ Check booking tồn tại
    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.bookingId },
      relations: ['homestay'],
    });
    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }

    // ✅ Check payment chưa tồn tại
    const existingPayment = await this.paymentRepository.findOne({
      where: { bookingId: createPaymentDto.bookingId },
    });
    if (existingPayment) {
      throw new BadRequestException('Booking này đã có payment rồi');
    }

    // ✅ Tính amount từ PriceCalendar
    const amount = await this.calculateAmount(
      booking.homestayId,
      booking.checkInDate,
      booking.checkOutDate,
    );

    const bankAccount = await this.bankAccountRepository.findOne({
      where: { userId: booking.homestay.userId },
    });
    if (!bankAccount) {
      throw new NotFoundException('Owner chưa có tài khoản ngân hàng');
    }

    // ✅ Gen QR code
    const qrCode = this.generateQRCode(amount, createPaymentDto.bookingId);

    // ✅ Tạo payment
    const payment = this.paymentRepository.create({
      bookingId: createPaymentDto.bookingId,
      userId,
      bankAccountId: bankAccount.id,
      amount,
      qrCode,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  private async calculateAmount(
    homestayId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<number> {
    // ✅ Lấy price từ PriceCalendar
    const priceCalendars = await this.priceCalendarRepository.find({
      where: {
        homestayId,
      },
    });

    if (priceCalendars.length === 0) {
      throw new NotFoundException('Chưa có giá cho homestay này');
    }

    let totalAmount = 0;
    const currentDate = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    while (currentDate < checkOut) {
      const priceCalendar = priceCalendars.find(
        (pc) =>
          new Date(pc.date).toDateString() === currentDate.toDateString(),
      );

      if (priceCalendar) {
        totalAmount += priceCalendar.price;
      } else {
        throw new BadRequestException(
          `Không có giá cho ngày ${currentDate.toDateString()}`,
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalAmount;
  }

  private generateQRCode(amount: number, bookingId: string): string {
    return `QR_${bookingId}_${amount}_${Date.now()}`;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { bookingId },
      relations: ['booking', 'user', 'bankAccount'],
    });

    if (!payment) {
      throw new NotFoundException('Payment không tồn tại');
    }

    return payment;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['booking', 'bankAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment không tồn tại');
    }

    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    if (status === PaymentStatus.COMPLETED) {
      payment.completedAt = new Date();
    }

    return this.paymentRepository.save(payment);
  }
}
