import { Module, OnModuleInit } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as express from 'express';

@Module({
  imports: [
    BullModule.registerQueue({ name: process.env.REDIS_REGISTRATION_QUEUE1 }),
    BullModule.registerQueue({ name: process.env.REDIS_REGISTRATION_QUEUE2 }),
  ],
})
export class BullBoardModule implements OnModuleInit {
  private readonly app = express();

  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue,
    @InjectQueue('math') private readonly mathQueue: Queue,
  ) {}

  onModuleInit() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [
        new BullMQAdapter(this.audioQueue),
        new BullMQAdapter(this.mathQueue),
      ],
      serverAdapter,
    });

    this.app.use('/admin/queues', serverAdapter.getRouter());
    this.app.listen(3050, () => {
      // console.log(
      //   '🚀 Bull Board running at http://localhost:3050/admin/queues',
      // );
    });
  }
}
