import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email đã được đăng ký');
    }

    const existingNickname = await this.userRepository.findOne({
      where: { nickname: createUserDto.nickname },
    });
    if (existingNickname) {
      throw new BadRequestException('Nickname đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        fullName: true,
        nickname: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User với ID ${id} không tồn tại`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    if (updateUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException('Email đã được sử dụng');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.findById(userId);
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    const user = await this.findById(userId);

    if (updateProfileDto.fullName) user.fullName = updateProfileDto.fullName;
    if (updateProfileDto.phone) user.phone = updateProfileDto.phone;
    if (updateProfileDto.avatar) user.avatar = updateProfileDto.avatar;
    if (updateProfileDto.address) user.address = updateProfileDto.address;

    await this.userRepository.update(userId, user);
    return this.getProfile(userId);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, passwordConfirm } = changePasswordDto;

    if (newPassword !== passwordConfirm) {
      throw new BadRequestException('Mật khẩu xác thực không khớp');
    }

    const user = await this.findById(userId);

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
