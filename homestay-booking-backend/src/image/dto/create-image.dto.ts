import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateImageDto {
  @IsUUID()
  homestayId!: string;

  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  altText?: string;
}
