import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return await this.userService.getProfile(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateProfile(user.id, updateProfileDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@CurrentUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(user.id, changePasswordDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
