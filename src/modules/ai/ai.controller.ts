import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('custom')
  @ApiOperation({ summary: 'Generate content from a custom prompt' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', example: 'Your custom prompt here' },
      },
    },
  })
  async generateCustom(@Body() bd: { prompt: string }) {
    const content = await this.aiService.generateContentFromCustomPrompt(
      bd.prompt,
    );
    return await { content };
  }

  @Get('specific')
  @ApiOperation({ summary: 'Generate specific content with a fixed prompt' })
  async generateSpecific() {
    const content = await this.aiService.generateSpecificContent();
    return await { content };
  }

  @Post('system-custom')
  @ApiOperation({ summary: 'Generate content from a custom prompt' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', example: 'Your custom prompt here' },
      },
    },
  })
  async generateSystemCustom(@Body() bd: { prompt: string }) {
    const content = await this.aiService.generateContentFromSystemCustomPrompt(
      bd.prompt,
    );
    return { content };
  }

  @Post('message-array-text-only')
  @ApiOperation({
    summary: 'Generate content using structured message array (Text only)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        systemPrompt: {
          type: 'string',
          example: 'You are an expert tech writer who explains things simply.',
        },
        userPrompt: {
          type: 'string',
          example: 'Explain how NestJS works in one paragraph.',
        },
      },
    },
  })
  async generateFromMessageArray(
    @Body() bd: { systemPrompt: string; userPrompt: string },
  ) {
    const content = await this.aiService.generateContentFromMessageArray(
      bd.systemPrompt,
      bd.userPrompt,
    );
    return { content };
  }

  @Post('ask-tool')
  @ApiOperation({ summary: 'Ask Gemini using the weather tool' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          example: 'What is the weather in Islamabad right now?',
        },
      },
    },
  })
  async askWithTool(@Body() body: { prompt: string }) {
    const response = await this.aiService.askWithTools(body.prompt);
    return { response };
  }
}
