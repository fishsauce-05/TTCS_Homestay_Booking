import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { Image } from '../entities/image.entity';

export class CreateImageDto {
  @IsString()
  url!: string;

  @IsString()
  filename!: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsEnum(Image)
  entityType!: Image;

  @IsUUID()
  entityId!: string;
}
