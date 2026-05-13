import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HomestayStatus } from '../../common/enums';

export class UpdateStatusDto {
  @IsEnum(HomestayStatus)
  status!: HomestayStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}