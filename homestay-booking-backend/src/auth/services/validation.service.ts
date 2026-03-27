import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateEmailNotExists(email: string): Promise<void> {
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException('Email đã được đăng ký');
    }
  }

  async validateNicknameNotExists(nickname: string): Promise<void> {
    const existingNickname = await this.userRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new BadRequestException('Nickname đã tồn tại');
    }
  }

  validatePasswordStrength(password: string): void {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái và số',
      );
    }
  }

  validatePasswordMatch(password: string, passwordConfirm: string): void {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Mật khẩu xác thực không khớp');
    }
  }

  validateUserNotLocked(user: User): void {
    if (user.isLocked) {
      throw new UnauthorizedException(
        `Tài khoản của bạn đã bị khóa. Lý do: ${user.lockReason}`,
      );
    }
  }

  async validateUserExists(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    return user;
  }
}
