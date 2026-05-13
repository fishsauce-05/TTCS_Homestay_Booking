import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { HomestayStatus } from '../../common/enums';
import { Review } from '../../review/entities/review.entity';
import { Room } from '../../room/entities/room.entity';

@Entity('homestays')
export class Homestay {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude!: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude!: number | null;

  @Column({ type: 'enum', enum: HomestayStatus, default: HomestayStatus.PENDING })
  status!: HomestayStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;

  @OneToMany(() => Room, (room) => room.homestay, { cascade: true })
  rooms!: Room[];

  @OneToMany(() => Review, (review) => review.homestay)
  reviews!: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
