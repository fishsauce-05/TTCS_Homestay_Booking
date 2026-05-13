import { IsUUID } from 'class-validator';

export class StatsRoomParamDto {
  @IsUUID()
  roomId!: string;
}
