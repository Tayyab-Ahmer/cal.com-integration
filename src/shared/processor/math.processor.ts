// src/shared/processor/math.processor.ts
import { Processor, WorkerHost /* , OnWorkerEvent */ } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('math')
export class MathProcessor extends WorkerHost {
  private readonly logger = new Logger(MathProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    const { num1, num2 } = job.data;

    let result: number;

    switch (job.name) {
      case 'math-add':
        result = num1 + num2;
        break;
      case 'math-subtract':
        result = num1 - num2;
        break;
      case 'math-multiply':
        result = num1 * num2;
        break;
      case 'math-divide':
        if (num2 === 0) throw new Error('Division by zero');
        result = num1 / num2;
        break;
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }

    this.logger.log(`✅ ${job.name} result = ${result}`);
    return result; // this will be sent back to job.waitUntilFinished()
  }
}
