import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(@Query('search') search?: string, @Query('role') role?: string) {
    return this.userService.findAll(search, role);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(user.id, dto);
  }

  @Patch(':id/lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  lockUser(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.userService.lockUser(id, body.reason);
  }

  @Patch(':id/unlock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  unlockUser(@Param('id') id: string) {
    return this.userService.unlockUser(id);
  }

  @Patch(':id/approve-owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  approveOwner(@Param('id') id: string) {
    return this.userService.approveOwner(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

