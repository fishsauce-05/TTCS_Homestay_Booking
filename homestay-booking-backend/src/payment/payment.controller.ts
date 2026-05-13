import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async markTransferred(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: User,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.markTransferred(createPaymentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllPayments(@Query('skip') skip = 0, @Query('take') take = 50) {
    return this.paymentService.findAll(skip, take);
  }

  @Get('owner/me')
  @UseGuards(JwtAuthGuard)
  async getOwnerPayments(@CurrentUser() user: User) {
    return this.paymentService.findForOwner(user.id);
  }

  @Get(':id')
  async getPaymentStatus(@Param('id') paymentId: string): Promise<PaymentResponseDto> {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approvePayment(
    @Param('id') paymentId: string,
    @CurrentUser() user: User,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.approvePayment(paymentId, user);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectPayment(
    @Param('id') paymentId: string,
    @CurrentUser() user: User,
    @Body() body: RejectPaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.rejectPayment(paymentId, user, body.reason);
  }
}
