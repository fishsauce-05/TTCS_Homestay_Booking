import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Homestay } from '../../homestay/entities/homestay.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homestay, (homestay) => homestay.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homestayId' })
  homestay: Homestay | null;

  @Column({ type: 'uuid', nullable: true })
  homestayId: string | null;

  @ManyToOne(() => Review, (review) => review.images, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'reviewId' })
  review: Review | null;

  @Column({ type: 'uuid', nullable: true })
  reviewId: string | null;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  altText: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
