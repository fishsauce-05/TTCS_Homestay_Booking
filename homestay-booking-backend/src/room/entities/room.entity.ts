import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Homestay } from '../../homestay/entities/homestay.entity';
import { Amenity } from '../../amenity/entities/amenity.entity';
import { PricingSchedule } from '../../pricing-schedule/entities/pricing-schedule.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { RoomStatus } from '../../common/enums';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Homestay, (homestay) => homestay.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'homestayId' })
  homestay!: Homestay;

  @Column({ type: 'uuid' })
  homestayId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  roomType!: string;

  @Column({ type: 'integer' })
  capacity!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  images!: string[] | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.ACTIVE })
  status!: RoomStatus;

  @ManyToMany(() => Amenity, (amenity) => amenity.rooms, { cascade: false })
  @JoinTable({
    name: 'room_amenities',
    joinColumn: { name: 'roomId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'amenityId', referencedColumnName: 'id' },
  })
  amenities!: Amenity[];

  @OneToMany(() => PricingSchedule, (ps) => ps.room, { cascade: true })
  pricingSchedules!: PricingSchedule[];

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
