import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TemplateUpdateDto } from './dto/template-update.dto';
import { TemplateCreateDto } from './dto/template-create.dto';
import { TemplateImageFileInterceptor } from './interceptors/template-image-file.interceptor';
import { TemplatesService } from './templates.service';
import { TemplateParamsDto } from './dto/template-params.dto';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}
  @Post()
  @UseInterceptors(TemplateImageFileInterceptor)
  async createTemplate(
    @UploadedFile() templateFile: Express.Multer.File,
    @Body() body: TemplateCreateDto,
    @User() user: UserPayloadDto,
  ) {
    await this.templateService.create({
      file: templateFile.buffer,
      filename: templateFile.originalname,
      ...body,
      userId: user._id,
    });

    return 'Template created successfully';
  }

  @Get()
  async getTemplates(@User() user: UserPayloadDto) {
    return await this.templateService.findAll(user._id);
  }

  @Get(':id')
  async getTemplate(
    @User() user: UserPayloadDto,
    @Param() params: TemplateParamsDto,
  ) {
    const dataset = await this.templateService.findOne({
      userId: user._id,
      templateId: params.id,
    });
    if (!dataset) throw new NotFoundException('Template not found');
    return dataset;
  }

  @Patch(':id')
  @UseInterceptors(TemplateImageFileInterceptor)
  async updateTemplate(
    @UploadedFile() templateFile: Express.Multer.File,
    @Body() body: TemplateUpdateDto,
    @Param() params: TemplateParamsDto,
    @User() user: UserPayloadDto,
  ) {
    await this.templateService.update({
      updateObj: {
        ...(body.name && { name: body.name }),
        ...(templateFile && {
          file: templateFile.buffer,
          filename: templateFile.originalname,
        }),
      },
      templateId: params.id,
      userId: user._id,
    });
    return 'Updated template successfully';
  }

  @Delete(':id')
  async deleteTemplate(
    @User() user: UserPayloadDto,
    @Param() params: TemplateParamsDto,
  ) {
    await this.templateService.remove({
      userId: user._id,
      templateId: params.id,
    });
    return 'Deleted template successfully';
  }
}
