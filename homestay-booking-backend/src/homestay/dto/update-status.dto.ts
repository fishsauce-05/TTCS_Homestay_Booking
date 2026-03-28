import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HomestayStatus } from '../enums/homestay-status.enum';

export class UpdateStatusDto {
  @IsEnum(HomestayStatus)
  status: HomestayStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}