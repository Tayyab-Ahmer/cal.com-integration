import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { chatDto, promtDto } from './dto/ai.dto';

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
  async generateCustom(@Body() bd: promtDto) {
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
  async generateSystemCustom(@Body() bd: promtDto) {
    const content = await this.aiService.generateContentFromSystemCustomPrompt(
      bd.prompt,
    );
    return { content };
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Chat with assistant using full conversation memory',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-1' },
        message: { type: 'string', example: 'what is nextjs?' },
      },
    },
  })
  async chatWithAssistant(@Body() body: chatDto) {
    const { userId, message } = body;
    const content = await this.aiService.chatWithAssistant(userId, message);
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
  async askWithTool(@Body() body: promtDto) {
    const response = await this.aiService.askWithTools(body.prompt);
    return { response };
  }
}
