import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRoomCommand } from './application/commands/create-room.command';
import { RemoveRoomCommand } from './application/commands/remove-room.command';
import { UpdateRoomCommand } from './application/commands/update-room.command';
import { FindAvailableRoomsQuery } from './application/queries/find-available-rooms.query';
import { FindFeaturedRoomsQuery } from './application/queries/find-featured-rooms.query';
import { FindPublicRoomsQuery } from './application/queries/find-public-rooms.query';
import { FindRoomDetailQuery } from './application/queries/find-room-detail.query';
import { FindRoomsByHomestayQuery } from './application/queries/find-rooms-by-homestay.query';
import { SearchRoomsQuery } from './application/queries/search-rooms.query';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  create(@Body() dto: CreateRoomDto) {
    return this.commandBus.execute(new CreateRoomCommand(dto));
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.queryBus.execute(new FindPublicRoomsQuery(query));
  }

  @Get('featured')
  findFeatured(@Query('limit') limit?: string) {
    return this.queryBus.execute(
      new FindFeaturedRoomsQuery(parseInt(limit || '6', 10) || 6),
    );
  }

  @Get('homestay/:homestayId')
  findByHomestay(@Param('homestayId') homestayId: string) {
    return this.queryBus.execute(new FindRoomsByHomestayQuery(homestayId));
  }

  @Get('available')
  findAvailable(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('guests') guests: string,
  ) {
    return this.queryBus.execute(
      new FindAvailableRoomsQuery(checkIn, checkOut, parseInt(guests) || 1),
    );
  }

  @Get('search')
  search(
    @Query('homestayId') homestayId: string,
    @Query('keyword') keyword: string,
  ) {
    return this.queryBus.execute(
      new SearchRoomsQuery(homestayId, keyword || ''),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new FindRoomDetailQuery(id, true));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.commandBus.execute(new UpdateRoomCommand(id, dto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveRoomCommand(id));
  }
}
