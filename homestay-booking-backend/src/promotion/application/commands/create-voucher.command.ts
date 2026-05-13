import { CreateVoucherDto } from '../../presentation/dto/create-voucher.dto';

export class CreateVoucherCommand {
  constructor(
    readonly dto: CreateVoucherDto,
    readonly adminId: string,
  ) {}
}
