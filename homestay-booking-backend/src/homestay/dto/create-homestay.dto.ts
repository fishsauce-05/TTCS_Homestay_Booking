import { IsString, IsNumber, IsInt, IsUUID } from 'class-validator';

export class CreateHomestayDto {
  @IsUUID()
  ownerId!: string;

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
}
