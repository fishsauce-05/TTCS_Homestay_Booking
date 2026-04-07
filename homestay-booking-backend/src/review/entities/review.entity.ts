import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Homestay } from '../../homestay/entities/homestay.entity';
import { Image } from '../../image/entities/image.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  homestayId: string;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1-5 stars

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  ownerReply: string; // Owner reply

  @Column({ type: 'uuid', nullable: true })
  ownerId: string; // Owner who replied

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn({ nullable: true })
  replyAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Homestay, (homestay) => homestay.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homestayId' })
  homestay: Homestay;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Image, (image) => image.review)
  images: Image[];
}