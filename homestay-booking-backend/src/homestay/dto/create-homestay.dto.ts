import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHomestayDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  address!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
