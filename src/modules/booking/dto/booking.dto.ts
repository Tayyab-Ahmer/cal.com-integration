import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  // IsTimeZone,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '2024-08-13T09:00:00Z' })
  @IsDateString()
  start: string;

  @ApiPropertyOptional({
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      timeZone: 'America/New_York',
      phoneNumber: '+919876543210',
      language: 'it',
    },
  })
  @IsOptional()
  @IsObject()
  attendee?: any;

  @ApiPropertyOptional({ example: { customField: 'customValue' } })
  @IsOptional()
  @IsObject()
  bookingFieldsResponses?: any;

  @ApiPropertyOptional({ example: 123 })
  @IsOptional()
  @IsInt()
  eventTypeId?: number;

  @ApiPropertyOptional({ example: 'my-event-type' })
  @IsOptional()
  @IsString()
  eventTypeSlug?: string;

  @ApiPropertyOptional({ example: 'john-doe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'john-doe' })
  @IsOptional()
  @IsString()
  teamSlug?: string;

  @ApiPropertyOptional({ example: 'acme-corp' })
  @IsOptional()
  @IsString()
  organizationSlug?: string;

  @ApiPropertyOptional({
    example: ['guest1@example.com', 'guest2@example.com'],
  })
  @IsOptional()
  guests?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/meeting' })
  @IsOptional()
  @IsString()
  meetingUrl?: string;

  // @ApiPropertyOptional({ example: { type: 'address' } })
  // @IsOptional()
  // @IsObject()
  // location?: any;

  // @ApiPropertyOptional({ example: { key: 'value' } })
  // @IsOptional()
  // @IsObject()
  // metadata?: any;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  lengthInMinutes?: number;

  @ApiPropertyOptional({
    example: { responseId: 123, teamMemberIds: [101, 102] },
  })
  @IsOptional()
  @IsObject()
  routing?: any;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  emailVerificationCode?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  instant?: boolean;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;
}
