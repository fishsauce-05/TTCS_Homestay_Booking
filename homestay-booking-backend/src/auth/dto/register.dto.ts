import { IsEmail, IsString, MinLength, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  passwordConfirm!: string;

  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phone!: string;
}
