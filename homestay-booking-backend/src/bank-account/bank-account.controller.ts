import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountController {
  constructor(private readonly service: BankAccountService) {}

  @Post()
  async create(@Body() dto: CreateBankAccountDto, @CurrentUser() user: User) {
    return await this.service.create(user.id, dto);
  }

  @Get('me')
  async getMyAccount(@CurrentUser() user: User) {
    return await this.service.findByUser(user.id);
  }

  @Patch('me')
  async update(@Body() dto: UpdateBankAccountDto, @CurrentUser() user: User) {
    return await this.service.update(user.id, dto);
  }

  @Delete('me')
  async remove(@CurrentUser() user: User) {
    return await this.service.remove(user.id);
  }

  // Admin only
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll() {
    return await this.service.findAll();
  }

  @Patch(':id/verify')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async verify(@Param('id') id: string) {
    return await this.service.verify(id);
  }
}
