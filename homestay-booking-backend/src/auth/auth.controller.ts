import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      nickname: req.user.nickname,
      role: req.user.role,
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminOnly(@Request() req) {
    return { message: 'Chỉ admin mới thấy được' };
  }

  @Get('owner-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async ownerOnly(@Request() req) {
    return { message: 'Chỉ owner và admin mới thấy được' };
  }
}
