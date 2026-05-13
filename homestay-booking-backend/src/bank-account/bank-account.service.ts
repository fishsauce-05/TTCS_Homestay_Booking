import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly repo: Repository<BankAccount>,
  ) {}

  async create(userId: string, dto: CreateBankAccountDto): Promise<BankAccount> {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) throw new ConflictException('Người dùng đã có tài khoản ngân hàng');
    const account = this.repo.create({ ...dto, userId });
    return this.repo.save(account);
  }

  async findByUser(userId: string): Promise<BankAccount | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async update(userId: string, dto: UpdateBankAccountDto): Promise<BankAccount> {
    const account = await this.repo.findOne({ where: { userId } });
    if (!account) throw new NotFoundException('Chưa có tài khoản ngân hàng');
    // Reset verification when bank info changes
    if (dto.bankName || dto.accountNumber || dto.accountHolderName) {
      account.isVerified = false;
    }
    Object.assign(account, dto);
    return this.repo.save(account);
  }

  async remove(userId: string): Promise<{ message: string }> {
    const account = await this.repo.findOne({ where: { userId } });
    if (!account) throw new NotFoundException('Chưa có tài khoản ngân hàng');
    await this.repo.remove(account);
    return { message: 'Xóa tài khoản ngân hàng thành công' };
  }

  async verify(id: string): Promise<BankAccount> {
    const account = await this.repo.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Tài khoản ngân hàng không tồn tại');
    account.isVerified = true;
    return this.repo.save(account);
  }

  async findAll(): Promise<BankAccount[]> {
    return this.repo.find({ relations: ['user'] });
  }
}
