import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomestayService } from './homestay.service';
import { HomestayController } from './homestay.controller';
import { Homestay } from './entities/homestay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Homestay])],
  controllers: [HomestayController],
  providers: [HomestayService],
  exports: [HomestayService],
})
export class HomestayModule {}
