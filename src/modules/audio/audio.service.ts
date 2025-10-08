import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  async addAudioJob(audioData: any) {
    const job = await this.audioQueue.add('process-audio', audioData, {
      delay: 1000, // Start after 1 second
      attempts: 3, // Retry 3 times if failed
      backoff: 5000, // Wait 5 seconds between retries
    });

    this.logger.log(`🎵 Added audio job ${job.id} to queue`);
    return job;
  }

  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.audioQueue.getWaiting(),
      this.audioQueue.getActive(),
      this.audioQueue.getCompleted(),
      this.audioQueue.getFailed(),
      this.audioQueue.getDelayed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }
}
