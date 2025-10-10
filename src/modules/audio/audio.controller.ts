import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AudioService } from './audio.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  private readonly logger = new Logger(AudioController.name);

  constructor(private readonly audioService: AudioService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process audio data asynchronously' })
  async processAudio(@Body() audioData: any) {
    this.logger.log('🎵 Received request to process audio');

    const job = await this.audioService.addAudioJob(audioData);

    return {
      message: 'Audio processing job added to queue',
      jobId: job.id,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test audio processing with sample data' })
  async testAudioProcessing() {
    // Add a test job with sample data
    const testData = {
      fileName: 'test-audio.mp3',
      format: 'mp3',
      duration: 180, // 3 minutes
      quality: 'high',
      testRun: true,
      timestamp: new Date().toISOString(),
    };

    const job = await this.audioService.addAudioJob(testData);

    return {
      message: 'Test audio job added',
      jobId: job.id,
      testData: testData,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audio queue statistics' })
  async getQueueStats() {
    const stats = await this.audioService.getQueueStats();
    return {
      message: 'Audio queue statistics',
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('math')
  @ApiOperation({
    summary: 'Perform a math operation (add, subtract, multiply, divide)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        num1: { type: 'number', example: 10 },
        num2: { type: 'number', example: 5 },
        operation: {
          type: 'string',
          example: 'add',
          enum: ['add', 'subtract', 'multiply', 'divide'],
        },
      },
      required: ['num1', 'num2', 'operation'],
    },
  })
  async processMath(
    @Body() body: { num1: number; num2: number; operation: string },
  ) {
    const { num1, num2, operation } = body;

    const jobResult = await this.audioService.addMathJob(num1, num2, operation);

    return {
      message: `Math job '${operation}' completed`,
      ...jobResult,
    };
  }

  @Post('math/parent')
  @ApiOperation({ summary: 'Demonstrate BullMQ parent-child job flow' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        a: { type: 'number', example: 2 },
        b: { type: 'number', example: 3 },
        c: { type: 'number', example: 4 },
      },
      required: ['a', 'b', 'c'],
    },
  })
  async createParentChildJobs(
    @Body() body: { a: number; b: number; c: number },
  ) {
    const { a, b, c } = body;

    const result = await this.audioService.createParentChildJobs(a, b, c);

    return {
      message: 'Parent-child jobs created',
      ...result,
    };
  }
}
