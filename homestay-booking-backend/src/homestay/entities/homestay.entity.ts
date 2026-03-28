import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Amenity } from '../../amenity/entities/amenity.entity';
import { Image } from '../../image/entities/image.entity';
import { PriceCalendar } from '../../price-calendar/entities/price-calendar.entity';
import { HomestayStatus } from '../enums/homestay-status.enum';
import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity('homestays')
export class Homestay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

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

  @OneToMany(() => Booking, booking => booking.homestay)
  booking: Booking[];

  @OneToMany(() => Review, review => review.homestay)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
