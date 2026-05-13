import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';
import { BookingStatus } from '../../common/enums';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({ type: 'uuid' })
  roomId!: string;

  @Column({ type: 'uuid', nullable: true })
  voucherId!: string | null;

  @Column({ type: 'date' })
  checkInDate!: string;

  @Column({ type: 'date' })
  checkOutDate!: string;

  @Column({ type: 'integer' })
  numberOfNights!: number;

  @Column({ type: 'integer' })
  numberOfGuests!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  roomPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  penaltyAmount!: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  refundAmount!: number | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column({ type: 'text', nullable: true })
  cancellationReason!: string | null;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments?: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
