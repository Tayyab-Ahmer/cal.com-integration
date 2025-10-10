// src/shared/processor/audio.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('audio')
export class AudioConsumer extends WorkerHost {
  private readonly logger = new Logger(AudioConsumer.name);

  async process(job: Job<any, any, string>): Promise<any> {
    // 🔹 1️⃣ Handle parent-child flow
    if (job.name === 'math-parent') {
      this.logger.log(
        `👨‍👩‍👧‍👦 Parent job ${job.id} created. Waiting for children to complete...`,
      );

      // BullMQ automatically completes parent when all children succeed
      // and fails if any child fails
      return {
        message: 'Parent job created, waiting for children...',
        jobId: job.id,
        childrenExpected: 2,
        createdAt: new Date().toISOString(),
      };
    }

    // 🔹 2️⃣ Handle your normal audio processing flow
    this.logger.log(
      `🎵 Starting job ${job.id} with data: ${JSON.stringify(job.data)}`,
    );

    const totalSteps = 10;
    let progress = 0;

    for (let i = 0; i < totalSteps; i++) {
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
    // Simulate processing time (0.5–1.5 seconds)
    const delay = Math.random() * 1000 + 500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    this.logger.debug(
      `🔧 Step ${step + 1} completed for job with data: ${JSON.stringify(data)}`,
    );
  }
}

/* import { Processor, WorkerHost } from '@nestjs/bullmq';
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
 */
