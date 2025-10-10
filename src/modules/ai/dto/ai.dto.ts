import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class promtDto {
  @ApiProperty({
    example: 'Your custom prompt here',
    description: 'The prompt to generate content from',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class chatDto {
  @ApiProperty({
    example: 'user-1',
    description: 'The ID of the user sending the message',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'What is Next.js?',
    description: 'The message content from the user',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
