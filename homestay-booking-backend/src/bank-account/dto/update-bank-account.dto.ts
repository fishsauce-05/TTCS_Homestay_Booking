import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  @Length(8, 20)
  accountNumber?: string;
}
