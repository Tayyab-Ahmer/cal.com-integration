import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadService } from 'src/shared/services/file-upload.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with optional image URL' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file to Supabase storage' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload',
        },
      },
      required: ['file'],
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { imageUrl: url };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
