import { CreateVoucherRedemptionDto } from '../../../presenters/http/dto/create-voucher-redemption.dto';

export class RedeemVoucherCommand {
  constructor(readonly dto: CreateVoucherRedemptionDto) {}
}
