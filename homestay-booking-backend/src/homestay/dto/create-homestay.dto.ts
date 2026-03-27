import { IsString, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreateHomestayDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  ward: string;

  @IsNumber()
  @Min(1)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  bathrooms: number;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];
}
