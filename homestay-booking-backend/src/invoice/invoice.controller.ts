import { Controller, Get, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { InvoiceBookingParamDto } from './dto/invoice-booking-param.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAll() {
    return this.invoiceService.getAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyInvoices(@CurrentUser() user: User) {
    return this.invoiceService.getByUserId(user.id);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  getByBookingId(@Param(new ValidationPipe({ whitelist: true })) params: InvoiceBookingParamDto) {
    return this.invoiceService.getByBookingId(params.bookingId);
  }
}
