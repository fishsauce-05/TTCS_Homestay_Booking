import { IsString, IsOptional, IsEnum } from 'class-validator';
import { HomestayStatus } from '../enums/homestay-status.enum';

export class UpdateStatusHomestayDto {
  @IsEnum(HomestayStatus)
  status!: HomestayStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string | null;
}
