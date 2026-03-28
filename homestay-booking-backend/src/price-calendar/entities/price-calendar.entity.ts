import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Homestay } from '../../homestay/entities/homestay.entity';
import { IsOptional } from 'class-validator';

@Entity('price_calendars')
@Index(['homestayId', 'date'], { unique: true })
export class PriceCalendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homestay, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homestayId' })
  homestay: Homestay;

  @Column({ type: 'uuid' })
  homestayId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsOptional()
  price: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}