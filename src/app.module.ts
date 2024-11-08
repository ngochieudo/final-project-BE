import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ListingsModule } from './listings/listings.module';
import { FavoriteController } from './favorite/favorite.controller';
import { FavoriteService } from './favorite/favorite.service';
import { FavoriteModule } from './favorite/favorite.module';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationService } from './reservation/reservation.service';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [AuthModule, UserModule, PrismaModule, ConfigModule, ListingsModule, FavoriteModule, ReservationModule, PaymentModule, CategoryModule],
  providers: [PrismaService, FavoriteService, PaymentService, ReviewService, ReservationService, CategoryService],
  controllers: [FavoriteController, PaymentController, ReviewController, ReservationController, CategoryController],
  
})
export class AppModule {}
