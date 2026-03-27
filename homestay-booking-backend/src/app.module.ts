import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomestayModule } from './homestay/homestay.module';
import { User } from './user/entities/user.entity';
import { Homestay } from './homestay/entities/homestay.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'homestay_booking',
      entities: [User, Homestay],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UserModule,
    HomestayModule,
  ],
})
export class AppModule {}
