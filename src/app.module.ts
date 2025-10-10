import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AiModule,
  AudioModule,
  BookingModule,
  BullBoardModule,
  PrismaModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullBoardModule,
    PrismaModule,
    UserModule,
    BookingModule,
    AudioModule,
    AiModule,
  ],
})
export class AppModule {}
