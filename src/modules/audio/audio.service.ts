import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue,
    @InjectQueue('math') private readonly mathQueue: Queue,
  ) {}

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

  async addMathJob(num1: number, num2: number, operation: string) {
    const validOps = ['add', 'subtract', 'multiply', 'divide'];
    if (!validOps.includes(operation)) {
      throw new Error(`Invalid operation: ${operation}`);
    }

    // Add the job
    const job = await this.mathQueue.add(
      `math-${operation}`,
      { num1, num2 },
      { attempts: 2 },
    );

    this.logger.log(`🧮 Added math job '${operation}' with ID ${job.id}`);

    // Wait until it’s processed and get result
    const queueEvents = new QueueEvents(this.audioQueue.name);
    const result = await job.waitUntilFinished(queueEvents);

    // Return detailed response
    return {
      jobId: job.id,
      name: job.name,
      data: job.data,
      timestamp: new Date().toISOString(),
      status: 'completed',
      result,
    };
  }

  async createParentChildJobs(a: number, b: number, c: number) {
    // Step 1️⃣: Create parent job
    const parentJob = await this.audioQueue.add('math-parent', { a, b, c });

    // Step 2️⃣: Create child jobs and link to parent
    const addJob = await this.mathQueue.add(
      'math-add',
      { num1: a, num2: b },
      {
        parent: {
          id: parentJob.id,
          queue: `${this.audioQueue.opts.prefix}:${this.audioQueue.name}`,
        },
      },
    );

    const multiplyJob = await this.mathQueue.add(
      'math-multiply',
      { num1: b, num2: c },
      {
        parent: {
          id: parentJob.id,
          queue: `${this.audioQueue.opts.prefix}:${this.audioQueue.name}`,
        },
      },
    );

    this.logger.log(
      `🧮 Created parent job ${parentJob.id} with children: [${addJob.id}, ${multiplyJob.id}]`,
    );

    return {
      parentId: parentJob.id,
      children: [
        { id: addJob.id, operation: 'add', data: addJob.data },
        { id: multiplyJob.id, operation: 'multiply', data: multiplyJob.data },
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
