import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AudioService } from './audio.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
