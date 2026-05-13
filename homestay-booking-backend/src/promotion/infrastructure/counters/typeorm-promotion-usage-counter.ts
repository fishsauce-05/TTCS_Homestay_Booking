import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromotionUsageCounterPort } from '../../application/ports/promotion-usage-counter.port';
import { Voucher } from '../persistence/entities/voucher.entity';

@Injectable()
export class TypeOrmPromotionUsageCounter implements PromotionUsageCounterPort {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async increment(voucherId: string): Promise<void> {
    await this.voucherRepo.increment({ id: voucherId }, 'usedCount', 1);
  }

  async decrement(voucherId: string): Promise<void> {
    await this.voucherRepo.decrement({ id: voucherId }, 'usedCount', 1);
  }
}
