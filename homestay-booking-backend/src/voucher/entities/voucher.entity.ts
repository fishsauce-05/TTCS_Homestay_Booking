import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { VoucherType } from '../enums/voucher-type.enum';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.vouchers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'enum', enum: VoucherType })
  type: VoucherType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({ type: 'int', nullable: true })
  maxUses: number | null;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @OneToOne(() => Booking, (booking) => booking.voucher, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
