import { IsString, IsNumber, IsInt, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateHomestayDto {
  @IsUUID()
  userId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  address!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsInt()
  maxGuests!: number;

  @IsInt()
  bedrooms!: number;

  @IsInt()
  bathrooms!: number;

  @IsNumber()
  basePrice!: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];
}
