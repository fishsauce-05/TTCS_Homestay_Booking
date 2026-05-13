import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { CreateVoucherHandler } from './application/commands/create-voucher/create-voucher.command-handler';
import { DeleteVoucherHandler } from './application/commands/delete-voucher/delete-voucher.command-handler';
import { DisableVoucherHandler } from './application/commands/disable-voucher/disable-voucher.command-handler';
import { GetVoucherDetailHandler } from './application/queries/get-voucher-detail/get-voucher-detail.query-handler';
import { ListVouchersHandler } from './application/queries/list-vouchers/list-vouchers.query-handler';
import { RedeemVoucherHandler } from './application/commands/redeem-voucher/redeem-voucher.command-handler';
import { UpdateVoucherHandler } from './application/commands/update-voucher/update-voucher.command-handler';
import { ValidateVoucherHandler } from './application/queries/validate-voucher/validate-voucher.query-handler';
import { PROMOTION_USAGE_COUNTER } from './application/ports/promotion-usage-counter.port';
import { REDEMPTION_REPOSITORY } from './application/ports/redemption-repository.port';
import { VOUCHER_REPOSITORY } from './application/ports/voucher-repository.port';
import { TypeOrmPromotionUsageCounter } from './infra/counters/typeorm-promotion-usage-counter';
import { TypeOrmRedemptionRepository } from './infra/persistence/typeorm-redemption.repository';
import { TypeOrmVoucherRepository } from './infra/persistence/typeorm-voucher.repository';
import { VoucherRedemption } from './infra/persistence/entities/voucher-redemption.entity';
import { Voucher } from './infra/persistence/entities/voucher.entity';
import { PromotionController } from './presenters/http/promotion.controller';

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
