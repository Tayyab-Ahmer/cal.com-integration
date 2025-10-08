import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingModule, PrismaModule, UserModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    BookingModule,
  ],
})
export class AppModule {}
