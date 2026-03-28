import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { ValidationService } from './services/validation.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly validationService: ValidationService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: any }> {
    const { fullName, nickname, email, password, passwordConfirm, phone } = registerDto;

    this.validationService.validatePasswordStrength(password);
    this.validationService.validatePasswordMatch(password, passwordConfirm);
    await this.validationService.validateEmailNotExists(email);
    await this.validationService.validateNicknameNotExists(nickname);

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user = this.userRepository.create({
      fullName,
      nickname,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.GUEST,
    });

    await this.userRepository.save(user);

    return {
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; accessToken: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.validationService.validateUserExists(email);
    this.validationService.validateUserNotLocked(user);

    const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const accessToken = this.tokenService.generateAccessToken(user.id, user.email, user.role);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  async validateUserFromToken(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return user;
  }
}
