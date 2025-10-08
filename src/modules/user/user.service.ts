import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UploadService } from 'src/shared/services/file-upload.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  // async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
  //   let imageUrl: string | undefined;

  //   if (file) {
  //     imageUrl = await this.uploadService.uploadImage(file);
  //   }

  //   return this.prisma.user.create({
  //     data: { ...createUserDto, imageUrl },
  //   });
  // }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
