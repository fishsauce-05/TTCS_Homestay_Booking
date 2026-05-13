import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { VoucherType } from '../../../../common/enums';

export class CreateVoucherDto {
  @IsString()
  code!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsEnum(VoucherType)
  type!: VoucherType;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  expiryDate!: Date;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderValue?: number;
}
