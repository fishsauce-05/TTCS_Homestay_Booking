import { Controller, Post, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.paymentService.createPayment(createPaymentDto, userId);
  }

  @Get('booking/:bookingId')
  async getPaymentByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentService.getPaymentByBookingId(bookingId);
  }

  @Get()
  async getMyPayments(@Request() req) {
    const userId = req.user.id;
    return this.paymentService.getPaymentsByUserId(userId);
  }

  @Patch(':paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() body: { status: PaymentStatus; transactionId?: string },
  ) {
    return this.paymentService.updatePaymentStatus(
      paymentId,
      body.status,
      body.transactionId,
    );
  }
}