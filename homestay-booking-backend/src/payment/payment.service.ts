import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { PaymentStatus, UserRole } from '../common/enums';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly notificationService: NotificationService,
  ) {}

  async markTransferred(createPaymentDto: CreatePaymentDto, currentUser: User): Promise<PaymentResponseDto> {
    const payment = await this.createOrGetPayment(createPaymentDto.bookingId);
    const booking = payment.booking;

    if (!booking) {
      throw new NotFoundException('Booking khong ton tai');
    }

    if (currentUser.role !== UserRole.ADMIN && booking.userId !== currentUser.id) {
      throw new ForbiddenException('Khong co quyen bao da chuyen khoan cho booking nay');
    }

    payment.status = PaymentStatus.WAITING_OWNER_APPROVAL;
    payment.reportedAt = new Date();
    payment.paidAt = null;
    payment.reviewedAt = null;
    payment.rejectionReason = null;
    payment.description = 'Khach hang da bao da chuyen khoan, dang cho owner xac nhan';

    const saved = await this.paymentRepo.save(payment);
    await this.notificationService.create({
      userId: booking.room.homestay.userId,
      title: 'Khach hang da bao chuyen khoan',
      message: `Booking ${booking.id} dang cho ban xac nhan thanh toan.`,
      type: 'payment_waiting_approval',
      data: {
        paymentId: saved.id,
        bookingId: booking.id,
        amount: Number(saved.amount),
      },
    });

    return this.toResponse(saved, 'Da gui thong bao cho owner de xac nhan thanh toan');
  }

  async approvePayment(paymentId: string, currentUser: User): Promise<PaymentResponseDto> {
    const payment = await this.findPaymentForReview(paymentId);
    this.assertCanReviewPayment(payment, currentUser);

    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    payment.reviewedAt = new Date();
    payment.rejectionReason = null;
    payment.description = 'Owner da xac nhan thanh toan';

    const saved = await this.paymentRepo.save(payment);
    await this.notificationService.create({
      userId: payment.booking!.userId,
      title: 'Thanh toan da duoc xac nhan',
      message: `Booking ${payment.bookingId} da duoc owner xac nhan thanh toan.`,
      type: 'payment_approved',
      data: {
        paymentId: saved.id,
        bookingId: saved.bookingId,
        amount: Number(saved.amount),
      },
    });

    return this.toResponse(saved, 'Da xac nhan thanh toan va gui thong bao cho khach hang');
  }

  async rejectPayment(paymentId: string, currentUser: User, reason?: string): Promise<PaymentResponseDto> {
    const payment = await this.findPaymentForReview(paymentId);
    this.assertCanReviewPayment(payment, currentUser);

    payment.status = PaymentStatus.REJECTED;
    payment.paidAt = null;
    payment.reviewedAt = new Date();
    payment.rejectionReason = reason ?? 'Owner chua xac nhan duoc giao dich';
    payment.description = 'Owner da tu choi xac nhan thanh toan';

    const saved = await this.paymentRepo.save(payment);
    await this.notificationService.create({
      userId: payment.booking!.userId,
      title: 'Thanh toan chua duoc xac nhan',
      message: `Booking ${payment.bookingId} chua duoc xac nhan thanh toan. ${payment.rejectionReason}`,
      type: 'payment_rejected',
      data: {
        paymentId: saved.id,
        bookingId: saved.bookingId,
        amount: Number(saved.amount),
        reason: saved.rejectionReason,
      },
    });

    return this.toResponse(saved, 'Da tu choi thanh toan va gui thong bao cho khach hang');
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment khong ton tai');
    }
    return this.toResponse(payment);
  }

  async findByBooking(bookingId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { bookingId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(skip = 0, take = 50): Promise<{ data: Payment[]; total: number }> {
    const [data, total] = await this.paymentRepo.findAndCount({
      relations: ['booking', 'booking.user', 'booking.room', 'booking.room.homestay'],
      skip: Number(skip) || 0,
      take: Number(take) || 50,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findForOwner(ownerId: string): Promise<Payment[]> {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('room.homestay', 'homestay')
      .where('homestay.userId = :ownerId', { ownerId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  private async createOrGetPayment(bookingId: string): Promise<Payment> {
    let payment = await this.paymentRepo.findOne({
      where: { bookingId },
      relations: ['booking', 'booking.user', 'booking.room', 'booking.room.homestay'],
    });

    if (payment) return payment;

    const bookingPayment = await this.paymentRepo.manager.findOne(Booking, {
      where: { id: bookingId },
      relations: ['user', 'room', 'room.homestay'],
    });

    if (!bookingPayment) {
      throw new NotFoundException('Booking khong ton tai');
    }

    const created = this.paymentRepo.create({
      bookingId,
      amount: Number(bookingPayment.totalPrice),
    });
    payment = await this.paymentRepo.save(created);
    payment.booking = bookingPayment;
    return payment;
  }

  private async findPaymentForReview(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['booking', 'booking.user', 'booking.room', 'booking.room.homestay'],
    });

    if (!payment || !payment.booking) {
      throw new NotFoundException('Payment khong ton tai');
    }

    return payment;
  }

  private assertCanReviewPayment(payment: Payment, currentUser: User): void {
    const ownerId = payment.booking?.room?.homestay?.userId;
    if (currentUser.role === UserRole.ADMIN || ownerId === currentUser.id) return;
    throw new ForbiddenException('Chi owner cua homestay moi duoc xac nhan thanh toan');
  }

  private toResponse(payment: Payment, message?: string): PaymentResponseDto {
    return {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      amount: Number(payment.amount),
      status: payment.status,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      reportedAt: payment.reportedAt,
      reviewedAt: payment.reviewedAt,
      message,
    };
  }
}

