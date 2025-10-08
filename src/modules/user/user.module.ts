import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadService } from 'src/shared/services/file-upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UploadService],
})
export class UserModule {}
