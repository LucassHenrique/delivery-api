import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [PrismaModule, UserModule, ProductModule],
})
export class AppModule {}
