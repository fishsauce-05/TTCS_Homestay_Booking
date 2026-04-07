import { IsString, IsNumber, IsInt, IsUUID, IsOptional, IsArray } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];
}
