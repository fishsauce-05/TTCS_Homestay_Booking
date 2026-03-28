import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Homestay } from '../../homestay/entities/homestay.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homestay, (homestay) => homestay.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homestayId' })
  homestay: Homestay;

  @Column({ type: 'uuid' })
  homestayId: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  altText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
