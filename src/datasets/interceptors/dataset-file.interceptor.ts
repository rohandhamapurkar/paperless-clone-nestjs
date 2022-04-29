import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DATASET_FILE_UPLOAD_SIZE_LIMIT,
  DATASET_FILE_UPLOAD_ALLOWED_EXTENSIONS,
} from '../constants';

/**
 * NestJS interceptor for form file upload validation
 */
export const DatasetFileInterceptor = FileInterceptor('file', {
  limits: {
    fileSize: DATASET_FILE_UPLOAD_SIZE_LIMIT,
  },
  fileFilter: (_, file, callback) => {
    const ext = file.originalname ? file.originalname.split('.')[1] : '';
    if (!DATASET_FILE_UPLOAD_ALLOWED_EXTENSIONS.includes(ext)) {
      callback(new BadRequestException('Invalid file extension'), false);
    }
    callback(null, true);
  },
});
