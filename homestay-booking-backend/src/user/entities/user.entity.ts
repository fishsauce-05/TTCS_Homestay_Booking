import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { BankAccount } from '../../bank-account/entities/bank-account.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'text', nullable: true })
  lockReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Voucher, (voucher) => voucher.user)
  @JoinColumn({ name: 'userId' })
  vouchers: Voucher[];

  @OneToOne(() => BankAccount, (bankAccount) => bankAccount.user)
  bankAccount: BankAccount;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

}
