import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { User } from '../../user/entities/user.entity';
import { CreateVoucherCommand } from '../application/commands/create-voucher.command';
import { DeleteVoucherCommand } from '../application/commands/delete-voucher.command';
import { DisableVoucherCommand } from '../application/commands/disable-voucher.command';
import { RedeemVoucherCommand } from '../application/commands/redeem-voucher.command';
import { UpdateVoucherCommand } from '../application/commands/update-voucher.command';
import { CreateVoucherHandler } from '../application/handlers/create-voucher.handler';
import { DeleteVoucherHandler } from '../application/handlers/delete-voucher.handler';
import { DisableVoucherHandler } from '../application/handlers/disable-voucher.handler';
import { GetVoucherDetailHandler } from '../application/handlers/get-voucher-detail.handler';
import { ListVouchersHandler } from '../application/handlers/list-vouchers.handler';
import { RedeemVoucherHandler } from '../application/handlers/redeem-voucher.handler';
import { UpdateVoucherHandler } from '../application/handlers/update-voucher.handler';
import { ValidateVoucherHandler } from '../application/handlers/validate-voucher.handler';
import { GetVoucherDetailQuery } from '../application/queries/get-voucher-detail.query';
import { ListVouchersQuery } from '../application/queries/list-vouchers.query';
import { ValidateVoucherQuery } from '../application/queries/validate-voucher.query';
import { Voucher } from '../infrastructure/persistence/entities/voucher.entity';
import { CreateVoucherRedemptionDto } from './dto/create-voucher-redemption.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller()
export class PromotionController {
  constructor(
    private readonly createVoucherHandler: CreateVoucherHandler,
    private readonly deleteVoucherHandler: DeleteVoucherHandler,
    private readonly disableVoucherHandler: DisableVoucherHandler,
    private readonly getVoucherDetailHandler: GetVoucherDetailHandler,
    private readonly listVouchersHandler: ListVouchersHandler,
    private readonly redeemVoucherHandler: RedeemVoucherHandler,
    private readonly updateVoucherHandler: UpdateVoucherHandler,
    private readonly validateVoucherHandler: ValidateVoucherHandler,
  ) {}

  @Post('vouchers/validate')
  @UseGuards(JwtAuthGuard)
  validateVoucher(@Body() body: { code: string; totalPrice: number }) {
    return this.validateVoucherHandler.execute(new ValidateVoucherQuery(body.code, body.totalPrice ?? 0));
  }

  @Post('vouchers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createVoucher(@Body() dto: CreateVoucherDto, @CurrentUser() user: User): Promise<Voucher> {
    return this.createVoucherHandler.execute(new CreateVoucherCommand(dto, user.id));
  }

  @Get('vouchers')
  getAllVouchers(): Promise<Voucher[]> {
    return this.listVouchersHandler.execute(new ListVouchersQuery());
  }

  @Get('vouchers/:id')
  getVoucherById(@Param('id') id: string): Promise<Voucher> {
    return this.getVoucherDetailHandler.execute(new GetVoucherDetailQuery(id));
  }

  @Patch('vouchers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateVoucher(@Param('id') id: string, @Body() dto: UpdateVoucherDto): Promise<Voucher> {
    return this.updateVoucherHandler.execute(new UpdateVoucherCommand(id, dto));
  }

  @Patch('vouchers/:id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggleStatus(@Param('id') id: string): Promise<Voucher> {
    return this.disableVoucherHandler.execute(new DisableVoucherCommand(id));
  }

  @Delete('vouchers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteVoucher(@Param('id') id: string): Promise<{ message: string }> {
    return this.deleteVoucherHandler.execute(new DeleteVoucherCommand(id));
  }

  @Post('voucher-redemption')
  @UseGuards(JwtAuthGuard)
  redeem(@Body() dto: CreateVoucherRedemptionDto) {
    return this.redeemVoucherHandler.execute(new RedeemVoucherCommand(dto));
  }
}
