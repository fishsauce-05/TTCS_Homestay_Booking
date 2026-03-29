import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomestayModule } from './homestay/homestay.module';
import { AmenityModule } from './amenity/amenity.module';
import { ImageModule } from './image/image.module';
import { PriceCalendarModule } from './price-calendar/price-calendar.module';
import { VoucherModule } from './voucher/voucher.module';
import { BookingModule } from './booking/booking.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UserModule,
    HomestayModule,
    AmenityModule,
    ImageModule,
    PriceCalendarModule,
    VoucherModule,
    BookingModule,
    BankAccountModule,
    PaymentModule,
    ReviewModule,
    NotificationModule,
  ],
})
export class AppModule {}
