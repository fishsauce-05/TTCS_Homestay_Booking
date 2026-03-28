import { IsString, IsNumber, IsEnum, IsDate, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { VoucherType } from '../enums/voucher-type.enum';

export class CreateVoucherDto {
  @IsString()
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsEnum(VoucherType)
  type!: VoucherType;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsDate()
  @Type(() => Date)
  expiryDate!: Date;
}