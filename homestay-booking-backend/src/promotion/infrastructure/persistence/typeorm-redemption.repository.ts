import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../../booking/entities/booking.entity';
import { RedemptionRepositoryPort } from '../../application/ports/redemption-repository.port';
import { VoucherRedemption } from './entities/voucher-redemption.entity';

@Injectable()
export class TypeOrmRedemptionRepository implements RedemptionRepositoryPort {
  constructor(
    @InjectRepository(VoucherRedemption)
    private readonly redemptionRepo: Repository<VoucherRedemption>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  findBookingById(id: string): Promise<Booking | null> {
    return this.bookingRepo.findOne({ where: { id } });
  }

  findByBookingAndVoucher(bookingId: string, voucherId: string): Promise<VoucherRedemption | null> {
    return this.redemptionRepo.findOne({ where: { bookingId, voucherId } });
  }

  async create(data: Pick<VoucherRedemption, 'bookingId' | 'voucherId' | 'userId' | 'voucherCode'>): Promise<VoucherRedemption> {
    const redemption = this.redemptionRepo.create(data);
    return this.redemptionRepo.save(redemption);
  }
}
