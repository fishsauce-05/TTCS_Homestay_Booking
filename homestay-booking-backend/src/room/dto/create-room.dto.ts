import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsUUID()
  homestayId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  roomType!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  capacity!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  basePrice!: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  amenityIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
