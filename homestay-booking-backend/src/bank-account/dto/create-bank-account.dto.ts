import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  accountNumber: string;
}
