import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  type?: string; // 'booking', 'review', 'payment', 'info'

  @IsUUID()
  @IsOptional()
  relatedId?: string; // booking/review/payment ID
}