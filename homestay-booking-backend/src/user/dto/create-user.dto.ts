import { IsEmail, IsString, MinLength, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
