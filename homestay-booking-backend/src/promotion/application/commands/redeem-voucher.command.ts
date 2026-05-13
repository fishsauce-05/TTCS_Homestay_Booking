import { CreateVoucherRedemptionDto } from '../../presentation/dto/create-voucher-redemption.dto';

export class RedeemVoucherCommand {
  constructor(readonly dto: CreateVoucherRedemptionDto) {}
}
