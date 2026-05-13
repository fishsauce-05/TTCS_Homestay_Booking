import { Controller, Get, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../common/enums';
import { StatsDateRangeQueryDto } from './dto/stats-date-range-query.dto';
import { StatsHomestayParamDto } from './dto/stats-homestay-param.dto';
import { StatsRoomParamDto } from './dto/stats-room-param.dto';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  @UseGuards(RolesGuard)
  @Roles('admin')
  platformSummary() {
    return this.statsService.platformSummary();
  }

  @Get('owner-summary')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  ownerSummary(@CurrentUser() user: User) {
    return this.statsService.ownerSummary(user.id);
  }

  @Get('revenue/homestay')
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  revenueByHomestay(
    @Query(new ValidationPipe({ whitelist: true })) query: StatsDateRangeQueryDto,
    @CurrentUser() user: User,
  ) {
    query.validateDateRange();
    const ownerId = user.role === UserRole.OWNER ? user.id : undefined;
    return this.statsService.revenueByHomestay(query.startDate, query.endDate, ownerId);
  }

  @Get('revenue/homestay/:homestayId/rooms')
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  revenueByRoom(
    @Param(new ValidationPipe({ whitelist: true })) params: StatsHomestayParamDto,
    @Query(new ValidationPipe({ whitelist: true })) query: StatsDateRangeQueryDto,
    @CurrentUser() user: User,
  ) {
    query.validateDateRange();
    const ownerId = user.role === UserRole.OWNER ? user.id : undefined;
    return this.statsService.revenueByRoom(params.homestayId, query.startDate, query.endDate, ownerId);
  }

  @Get('revenue/room/:roomId/bookings')
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  bookingsByRoom(
    @Param(new ValidationPipe({ whitelist: true })) params: StatsRoomParamDto,
    @Query(new ValidationPipe({ whitelist: true })) query: StatsDateRangeQueryDto,
    @CurrentUser() user: User,
  ) {
    query.validateDateRange();
    const ownerId = user.role === UserRole.OWNER ? user.id : undefined;
    return this.statsService.bookingsByRoom(params.roomId, query.startDate, query.endDate, ownerId);
  }
}

