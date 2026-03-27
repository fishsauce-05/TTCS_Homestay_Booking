import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HomestayStatus } from '../entities/homestay.entity';

export class UpdateStatusDto {
  @IsEnum(HomestayStatus)
  status: HomestayStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}