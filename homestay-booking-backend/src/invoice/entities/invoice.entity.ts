import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToOne, JoinColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column({ type: 'uuid', unique: true })
  bookingId!: string;

  @Column({ type: 'varchar', length: 255 })
  customerName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  roomName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  homestayName!: string | null;

  @Column({ type: 'date' })
  checkInDate!: string;

  @Column({ type: 'date' })
  checkOutDate!: string;

  @Column({ type: 'integer' })
  numberOfNights!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerNight!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  roomPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  penaltyAmount!: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  refundAmount!: number | null;

  @Column({ type: 'varchar', length: 20, default: 'booking' })
  invoiceType!: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}

