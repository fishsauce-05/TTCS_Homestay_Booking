import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateImageDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsUUID()
  homestayId?: string;

  @IsOptional()
  @IsUUID()
  reviewId?: string;
}
