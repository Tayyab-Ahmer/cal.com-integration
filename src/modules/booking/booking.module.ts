import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CalService } from 'src/shared/services/cal.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingController],
  providers: [BookingService, CalService],
})
export class BookingModule {}
