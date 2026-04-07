import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../user/entities/user.entity';

@Entity('voucher_redemptions')
@Unique(['bookingId'])
export class VoucherRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Voucher, (voucher) => voucher.redemptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @Column({ type: 'uuid' })
  voucherId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ type: 'uuid' })
  bookingId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}
