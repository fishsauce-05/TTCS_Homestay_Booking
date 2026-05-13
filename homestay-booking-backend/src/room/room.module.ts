import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Amenity } from '../amenity/entities/amenity.entity';
import { RoomCommandHandlers, RoomQueryHandlers } from './application/handlers';
import { ROOM_REPOSITORY } from './application/ports/room-repository.port';
import { TypeOrmRoomRepository } from './infrastructure/persistence/typeorm-room.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Room, Amenity])],
  controllers: [RoomController],
  providers: [
    RoomService,
    TypeOrmRoomRepository,
    ...RoomCommandHandlers,
    ...RoomQueryHandlers,
    { provide: ROOM_REPOSITORY, useExisting: TypeOrmRoomRepository },
  ],
  exports: [RoomService],
})
export class RoomModule {}
