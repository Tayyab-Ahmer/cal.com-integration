import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AudioConsumer } from 'src/shared/processor/audio.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [AudioController],
  providers: [AudioService, AudioConsumer],
})
export class AudioModule {}
