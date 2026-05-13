import { UpdateVoucherDto } from '../../../presenters/http/dto/update-voucher.dto';

export class UpdateVoucherCommand {
  constructor(
    readonly voucherId: string,
    readonly dto: UpdateVoucherDto,
  ) {}
}
