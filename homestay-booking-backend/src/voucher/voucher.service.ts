import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  async createVoucher(createVoucherDto: CreateVoucherDto, adminId: string): Promise<Voucher> {
    const voucher = this.voucherRepository.create();
    voucher.code = createVoucherDto.code;
    voucher.description = createVoucherDto.description || null;
    voucher.discountValue = createVoucherDto.discountValue;
    voucher.type = createVoucherDto.type;
    voucher.maxUses = createVoucherDto.maxUses || null;
    voucher.expiryDate = createVoucherDto.expiryDate;
    voucher.userId = adminId;
    
    return this.voucherRepository.save(voucher);
  }

  async getAllVouchers(): Promise<Voucher[]> {
    return this.voucherRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getVoucherById(id: string): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    return voucher;
  }

  async updateVoucher(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    const voucher = await this.getVoucherById(id);

    Object.assign(voucher, updateVoucherDto);
    return this.voucherRepository.save(voucher);
  }

  async deleteVoucher(id: string): Promise<{ message: string }> {
    const voucher = await this.getVoucherById(id);
    await this.voucherRepository.remove(voucher);
    return { message: 'Xóa voucher thành công' };
  }
}