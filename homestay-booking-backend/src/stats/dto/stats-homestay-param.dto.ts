import { IsUUID } from 'class-validator';

export class StatsHomestayParamDto {
  @IsUUID()
  homestayId!: string;
}
