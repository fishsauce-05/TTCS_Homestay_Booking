import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.bankAccountService.createBankAccount(createBankAccountDto, userId);
  }

  @Get()
  async getBankAccount(@Request() req) {
    const userId = req.user.id;
    return this.bankAccountService.getBankAccountByUserId(userId);
  }

  @Patch()
  async updateBankAccount(
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.bankAccountService.updateBankAccount(userId, updateBankAccountDto);
  }

  @Delete()
  async deleteBankAccount(@Request() req) {
    const userId = req.user.id;
    return this.bankAccountService.deleteBankAccount(userId);
  }
}
