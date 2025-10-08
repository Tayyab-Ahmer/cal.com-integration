import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example:
      'https://xyz.supabase.co/storage/v1/object/public/user-images/avatar.jpg',
    description: 'Public URL of uploaded image (from /upload endpoint)',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
export class UpdateUserDto extends CreateUserDto {}
