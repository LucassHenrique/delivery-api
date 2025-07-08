import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
})
export class AppModule {}
