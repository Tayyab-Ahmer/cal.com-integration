import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AudioConsumer } from 'src/shared/processor/audio.processor';
import { MathProcessor } from 'src/shared/processor/math.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: String(process.env.REDIS_REGISTRATION_QUEUE1),
    }),
    BullModule.registerQueue({
      name: String(process.env.REDIS_REGISTRATION_QUEUE2),
    }),
  ],
  controllers: [AudioController],
  providers: [AudioService, AudioConsumer, MathProcessor],
})
export class AudioModule {}
