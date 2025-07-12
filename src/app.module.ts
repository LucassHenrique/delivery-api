import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from './modules/messaging/messaging.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ProductModule,
    OrderModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessagingModule,
  ],
})
export class AppModule {}
