import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VoucherRedemptionService } from './voucher-redemption.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('voucher-redemptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class VoucherRedemptionController {
  constructor(private readonly voucherRedemptionService: VoucherRedemptionService) {}

  @Get()
  async getAllRedemptions() {
    return this.voucherRedemptionService.getAllRedemptions();
  }

  @Get('voucher/:voucherId')
  async getRedemptionsByVoucherId(@Param('voucherId') voucherId: string) {
    return this.voucherRedemptionService.getRedemptionsByVoucherId(voucherId);
  }

  @Get('booking/:bookingId')
  async getRedemptionByBookingId(@Param('bookingId') bookingId: string) {
    return this.voucherRedemptionService.getRedemptionByBookingId(bookingId);
  }
}
