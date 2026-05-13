import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;
}

