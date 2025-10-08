import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('audio')
export class AudioConsumer extends WorkerHost {
  private readonly logger = new Logger(AudioConsumer.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`🎵 Starting job ${job.id} with data:`, job.data);

    let progress = 0;
    const totalSteps = 10;

    // Simulate audio processing work
    for (let i = 0; i < totalSteps; i++) {
      // Simulate some work
      await this.doSomething(job.data, i);

      progress += 10;
      await job.updateProgress(progress);

      this.logger.log(`📊 Job ${job.id} progress: ${progress}%`);
    }

    this.logger.log(`✅ Job ${job.id} completed successfully!`);

    return {
      message: 'Audio processing completed',
      originalData: job.data,
      processedAt: new Date().toISOString(),
      stepsCompleted: totalSteps,
    };
  }

  private async doSomething(data: any, step: number): Promise<void> {
    // Simulate processing time (0.5-1.5 seconds)
    const delay = Math.random() * 1000 + 500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    this.logger.debug(`🔧 Step ${step + 1} completed for job with data:`, data);
  }
}
