import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { TemplateQueryParamDto } from './dto/template-query-param.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  async create(
    @UploadedFile() templateFile: Express.Multer.File,
    @Query() query: TemplateQueryParamDto,
  ) {
    if (!templateFile) {
      throw new NotFoundException("Form data doesn't contain any file.");
    }

    await this.templateService.create(templateFile.buffer);
  }
}
