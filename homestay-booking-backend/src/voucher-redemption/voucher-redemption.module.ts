import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../voucher/entities/voucher.entity';
import { VoucherRedemption } from './entities/voucher-redemption.entity';
import { VoucherRedemptionController } from './voucher-redemption.controller';
import { VoucherRedemptionService } from './voucher-redemption.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, VoucherRedemption])],
  controllers: [VoucherRedemptionController],
  providers: [VoucherRedemptionService],
  exports: [VoucherRedemptionService],
})
export class VoucherRedemptionModule {}
