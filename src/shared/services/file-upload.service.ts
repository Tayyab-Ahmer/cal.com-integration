import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${fileExt}`;
      const filePath = `users/${fileName}`;

      const { error } = await this.supabase.storage
        .from(process.env.STORAGE_BUCKET)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data: publicUrlData } = this.supabase.storage
        .from(process.env.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error(error);
      throw new Error('Image upload failed');
    }
  }
}
