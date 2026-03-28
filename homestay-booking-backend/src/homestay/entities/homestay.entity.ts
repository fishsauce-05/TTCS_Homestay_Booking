import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Amenity } from '../../amenity/entities/amenity.entity';
import { Image } from '../../image/entities/image.entity';
import { PriceCalendar } from '../../price-calendar/entities/price-calendar.entity';
import { HomestayStatus } from '../enums/homestay-status.enum';

@Entity('homestays')
export class Homestay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'integer' })
  maxGuests: number;

  @Column({ type: 'integer' })
  bedrooms: number;

  @Column({ type: 'integer' })
  bathrooms: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'enum', enum: HomestayStatus, default: HomestayStatus.PENDING })
  status: HomestayStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @OneToMany(() => Amenity, amenity => amenity.homestay, { cascade: true })
  amenities: Amenity[];

  @OneToMany(() => Image, image => image.homestay, { cascade: true })
  images: Image[];

  @OneToMany(() => PriceCalendar, priceCalendar => priceCalendar.homestay, { cascade: true })
  priceCalendars: PriceCalendar[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
