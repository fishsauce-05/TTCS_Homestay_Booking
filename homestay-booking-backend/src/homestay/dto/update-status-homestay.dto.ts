import { IsString, IsOptional, IsEnum } from 'class-validator';
import { HomestayStatus } from '../../common/enums';

export class UpdateStatusHomestayDto {
  @IsEnum(HomestayStatus)
  status!: HomestayStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string | null;
}


