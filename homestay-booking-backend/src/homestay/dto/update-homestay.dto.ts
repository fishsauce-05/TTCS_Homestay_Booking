import { IsString, IsNumber, IsInt, IsUUID, IsOptional } from 'class-validator';

export class UpdateHomestayDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsInt()
  @IsOptional()
  maxGuests?: number;

  @IsInt()
  @IsOptional()
  bedrooms?: number;

  @IsInt()
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  basePrice?: number;
}
