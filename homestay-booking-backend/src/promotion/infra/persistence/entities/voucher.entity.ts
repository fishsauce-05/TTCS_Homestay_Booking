import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VoucherStatus, VoucherType } from '../../../../common/enums';
import { User } from '../../../../user/entities/user.entity';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.vouchers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: VoucherType })
  type!: VoucherType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue!: number;

  @Column({ type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ type: 'date' })
  expiryDate!: Date;

  @Column({ type: 'int', nullable: true })
  maxUses!: number | null;

  @Column({ type: 'int', default: 0 })
  usedCount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  minOrderValue!: number | null;

  @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.ACTIVE })
  status!: VoucherStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
