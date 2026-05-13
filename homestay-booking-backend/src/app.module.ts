import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomestayModule } from './homestay/homestay.module';
import { AmenityModule } from './amenity/amenity.module';
import { RoomModule } from './room/room.module';
import { PricingScheduleModule } from './pricing-schedule/pricing-schedule.module';
import { PromotionModule } from './promotion/promotion.module';
import { BookingModule } from './booking/booking.module';
import { InvoiceModule } from './invoice/invoice.module';
import { StatsModule } from './stats/stats.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UserModule,
    HomestayModule,
    AmenityModule,
    RoomModule,
    PricingScheduleModule,
    PromotionModule,
    BookingModule,
    InvoiceModule,
    StatsModule,
    ReviewModule,
    PaymentModule,
    BankAccountModule,
    NotificationModule,
  ],
})
export class AppModule {}


