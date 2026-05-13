import { Voucher } from '../../domain/voucher';
import { CreateVoucherDto } from '../../presenters/http/dto/create-voucher.dto';

export const VOUCHER_REPOSITORY = Symbol('VOUCHER_REPOSITORY');

export interface VoucherRepositoryPort {
  create(dto: CreateVoucherDto, adminId: string): Promise<Voucher>;
  findAll(): Promise<Voucher[]>;
  findById(id: string): Promise<Voucher | null>;
  findByCode(code: string): Promise<Voucher | null>;
  save(voucher: Voucher): Promise<Voucher>;
  remove(voucher: Voucher): Promise<void>;
}
