import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  TEMPLATE_IMAGE_ACCEPTED_MIME_TYPES,
  TEMPLATE_IMAGE_UPLOAD_SIZE_LIMIT,
} from '../constants';

export const TemplateImageFileInterceptor = FileInterceptor('file', {
  limits: {
    fileSize: TEMPLATE_IMAGE_UPLOAD_SIZE_LIMIT,
  },
  fileFilter: (_, file, callback) => {
    if (!TEMPLATE_IMAGE_ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException('Unsupported template image mime type'),
        false,
      );
    }
    callback(null, true);
  },
});
