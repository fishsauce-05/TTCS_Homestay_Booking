import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { CreateVoucherHandler } from './application/handlers/create-voucher.handler';
import { DeleteVoucherHandler } from './application/handlers/delete-voucher.handler';
import { DisableVoucherHandler } from './application/handlers/disable-voucher.handler';
import { GetVoucherDetailHandler } from './application/handlers/get-voucher-detail.handler';
import { ListVouchersHandler } from './application/handlers/list-vouchers.handler';
import { RedeemVoucherHandler } from './application/handlers/redeem-voucher.handler';
import { UpdateVoucherHandler } from './application/handlers/update-voucher.handler';
import { ValidateVoucherHandler } from './application/handlers/validate-voucher.handler';
import { PROMOTION_USAGE_COUNTER } from './application/ports/promotion-usage-counter.port';
import { REDEMPTION_REPOSITORY } from './application/ports/redemption-repository.port';
import { VOUCHER_REPOSITORY } from './application/ports/voucher-repository.port';
import { TypeOrmPromotionUsageCounter } from './infrastructure/counters/typeorm-promotion-usage-counter';
import { TypeOrmRedemptionRepository } from './infrastructure/persistence/typeorm-redemption.repository';
import { TypeOrmVoucherRepository } from './infrastructure/persistence/typeorm-voucher.repository';
import { VoucherRedemption } from './infrastructure/persistence/entities/voucher-redemption.entity';
import { Voucher } from './infrastructure/persistence/entities/voucher.entity';
import { PromotionController } from './presentation/promotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, VoucherRedemption, Booking])],
  controllers: [PromotionController],
  providers: [
    CreateVoucherHandler,
    DeleteVoucherHandler,
    DisableVoucherHandler,
    GetVoucherDetailHandler,
    ListVouchersHandler,
    RedeemVoucherHandler,
    UpdateVoucherHandler,
    ValidateVoucherHandler,
    TypeOrmVoucherRepository,
    TypeOrmRedemptionRepository,
    TypeOrmPromotionUsageCounter,
    { provide: VOUCHER_REPOSITORY, useExisting: TypeOrmVoucherRepository },
    {
      provide: REDEMPTION_REPOSITORY,
      useExisting: TypeOrmRedemptionRepository,
    },
    {
      provide: PROMOTION_USAGE_COUNTER,
      useExisting: TypeOrmPromotionUsageCounter,
    },
  ],
  exports: [VOUCHER_REPOSITORY, REDEMPTION_REPOSITORY, PROMOTION_USAGE_COUNTER],
})
export class PromotionModule {}
