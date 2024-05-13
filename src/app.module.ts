import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ListingsModule } from './listings/listings.module';


@Module({
  imports: [AuthModule, UserModule, PostModule, PrismaModule, ConfigModule, ListingsModule],
  providers: [PrismaService],
  controllers: [],
  
})
export class AppModule {}
