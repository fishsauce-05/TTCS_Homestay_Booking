import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createVoucher(
    @Body() createVoucherDto: CreateVoucherDto,
    @CurrentUser() user: User,
  ) {
    return this.voucherService.createVoucher(createVoucherDto, user.id);
  }

  @Get()
  async getAllVouchers() {
    return this.voucherService.getAllVouchers();
  }

  @Get(':id')
  async getVoucherById(@Param('id') id: string) {
    return this.voucherService.getVoucherById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateVoucher(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.voucherService.updateVoucher(id, updateVoucherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteVoucher(@Param('id') id: string) {
    return this.voucherService.deleteVoucher(id);
  }
}
