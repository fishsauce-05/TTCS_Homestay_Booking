import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../../booking/entities/booking.entity';
import { RedeemableBooking } from '../../domain/redeemable-booking';
import { Redemption } from '../../domain/redemption';
import { RedemptionRepositoryPort } from '../../application/ports/redemption-repository.port';
import { VoucherRedemption } from './entities/voucher-redemption.entity';
import { RedemptionMapper } from './mappers/redemption.mapper';

@Injectable()
export class TypeOrmRedemptionRepository implements RedemptionRepositoryPort {
  constructor(
    @InjectRepository(VoucherRedemption)
    private readonly redemptionRepo: Repository<VoucherRedemption>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async findBookingById(id: string): Promise<RedeemableBooking | null> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    return booking ? RedemptionMapper.bookingToDomain(booking) : null;
  }

  async findByBookingAndVoucher(
    bookingId: string,
    voucherId: string,
  ): Promise<Redemption | null> {
    const redemption = await this.redemptionRepo.findOne({
      where: { bookingId, voucherId },
    });
    return redemption ? RedemptionMapper.toDomain(redemption) : null;
  }

  async create(
    data: Pick<
      Redemption,
      'bookingId' | 'voucherId' | 'userId' | 'voucherCode'
    >,
  ): Promise<Redemption> {
    const redemption = this.redemptionRepo.create(data);
    return RedemptionMapper.toDomain(
      await this.redemptionRepo.save(redemption),
    );
  }
}
