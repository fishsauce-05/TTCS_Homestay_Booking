import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existingEmail = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingEmail) throw new BadRequestException('Email đã được đăng ký');

    const existingNickname = await this.userRepo.findOne({ where: { nickname: dto.nickname } });
    if (existingNickname) throw new BadRequestException('Nickname đã tồn tại');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findAll(search?: string, role?: string): Promise<Omit<User, 'password'>[]> {
    const qb = this.userRepo.createQueryBuilder('u').orderBy('u.createdAt', 'DESC');

    if (search) {
      qb.andWhere('(u.fullName ILIKE :s OR u.email ILIKE :s OR u.phone ILIKE :s)', { s: `%${search}%` });
    }
    if (role) {
      qb.andWhere('u.role = :role', { role });
    }

    const users = await qb.getMany();
    return users.map(({ password, ...u }) => u as Omit<User, 'password'>);
  }

  async findPendingOwners(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find({
      where: { role: UserRole.OWNER, isEmailVerified: true, isLocked: false },
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...u }) => u as Omit<User, 'password'>);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User không tồn tại`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    await this.findById(id);
    if (dto.email) {
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== id) throw new BadRequestException('Email đã được sử dụng');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    await this.userRepo.update(id, dto);
    const updated = await this.findById(id);
    const { password, ...result } = updated;
    return result as Omit<User, 'password'>;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepo.delete(id);
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.findById(userId);
    const { password, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Omit<User, 'password'>> {
    const user = await this.findById(userId);
    if (dto.fullName) user.fullName = dto.fullName;
    if (dto.phone) user.phone = dto.phone;
    if (dto.avatar) user.avatar = dto.avatar;
    if (dto.address) user.address = dto.address;
    await this.userRepo.save(user);
    return this.getProfile(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, passwordConfirm } = dto;
    if (newPassword !== passwordConfirm) throw new BadRequestException('Mật khẩu xác thực không khớp');

    const user = await this.findById(userId);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');

    await this.userRepo.update(userId, { password: await bcrypt.hash(newPassword, 10) });
    return { message: 'Đổi mật khẩu thành công' };
  }

  async lockUser(id: string, reason?: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    user.isLocked = true;
    user.lockReason = reason ?? 'Vi phạm chính sách';
    await this.userRepo.save(user);
    return { message: 'Đã khóa tài khoản' };
  }

  async unlockUser(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    user.isLocked = false;
    user.lockReason = '';
    await this.userRepo.save(user);
    return { message: 'Đã mở khóa tài khoản' };
  }

  async approveOwner(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (user.role !== UserRole.OWNER) throw new BadRequestException('Tài khoản này không phải Owner');
    user.isEmailVerified = true;
    user.isLocked = false;
    await this.userRepo.save(user);
    return { message: 'Đã duyệt tài khoản Owner' };
  }
}

