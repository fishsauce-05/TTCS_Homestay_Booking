import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateAmenityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}
