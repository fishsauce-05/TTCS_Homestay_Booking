import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Booking } from '../../../../booking/entities/booking.entity';
import { User } from '../../../../user/entities/user.entity';
import { Voucher } from './voucher.entity';

@Entity('voucher_redemptions')
@Unique(['bookingId', 'voucherId'])
export class VoucherRedemption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  bookingId!: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column({ type: 'uuid' })
  voucherId!: string;

  @ManyToOne(() => Voucher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voucherId' })
  voucher!: Voucher;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 50 })
  voucherCode!: string;

  @CreateDateColumn()
  redeemedAt!: Date;
}
