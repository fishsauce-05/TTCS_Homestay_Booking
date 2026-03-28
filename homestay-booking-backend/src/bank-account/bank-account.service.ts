import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    userId: string,
  ): Promise<BankAccount> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Chỉ OWNER mới được tạo tài khoản ngân hàng');
    }

    const existingBankAccount = await this.bankAccountRepository.findOne({
      where: { userId },
    });
    if (existingBankAccount) {
      throw new ConflictException('User đã có tài khoản ngân hàng rồi');
    }

    const bankAccount = this.bankAccountRepository.create({
      ...createBankAccountDto,
      userId,
    });

    return this.bankAccountRepository.save(bankAccount);
  }

  async getBankAccountByUserId(userId: string): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!bankAccount) {
      throw new NotFoundException('Tài khoản ngân hàng không tồn tại');
    }

    return bankAccount;
  }

  async updateBankAccount(
    userId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {
    const bankAccount = await this.getBankAccountByUserId(userId);

    Object.assign(bankAccount, updateBankAccountDto);
    return this.bankAccountRepository.save(bankAccount);
  }

  async deleteBankAccount(userId: string): Promise<{ message: string }> {
    const bankAccount = await this.getBankAccountByUserId(userId);
    await this.bankAccountRepository.remove(bankAccount);

    return { message: 'Xóa tài khoản ngân hàng thành công' };
  }

  async verifyBankAccount(userId: string): Promise<BankAccount> {
    const bankAccount = await this.getBankAccountByUserId(userId);
    bankAccount.isVerified = true;

    return this.bankAccountRepository.save(bankAccount);
  }
}
