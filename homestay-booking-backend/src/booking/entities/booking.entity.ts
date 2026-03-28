import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Homestay } from '../../homestay/entities/homestay.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Homestay, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homestayId' })
  homestay: Homestay;

  @Column({ type: 'uuid' })
  homestayId: string;

  @OneToOne(() => Voucher, (voucher) => voucher.booking, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @Column({ type: 'uuid', nullable: true })
  voucherId: string | null;

  @Column({ type: 'date' })
  checkInDate: string;

  @Column({ type: 'date' })
  checkOutDate: string;

  @Column({ type: 'integer' })
  numberOfGuests: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  roomPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
