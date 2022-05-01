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

import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TemplateUpdateDto } from './dto/template-update.dto';
import { TemplateCreateDto } from './dto/template-create.dto';
import { TemplateImageFileInterceptor } from './interceptors/template-image-file.interceptor';
import { TemplatesService } from './templates.service';
import { TemplateParamsDto } from './dto/template-params.dto';
import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('templates')
@Permissions('crud:templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  /**
   * creates template by uploading form data with image and name
   */
  @Post()
  @UseInterceptors(TemplateImageFileInterceptor)
  async createTemplate(
    @UploadedFile() templateFile: Express.Multer.File,
    @Body() body: TemplateCreateDto,
    @RequestUser() user: UserTokenDto,
  ) {
    await this.templateService.create({
      file: templateFile.buffer,
      filename: templateFile.originalname,
      ...body,
      userId: user._id,
    });

    return 'Template created successfully';
  }

  /**
   * gets templates uploaded by a user
   */
  @Get()
  async getTemplates(@RequestUser() user: UserTokenDto) {
    return await this.templateService.findAll(user._id);
  }

  /**
   * gets singular template uploaded by a user
   */
  @Get(':id')
  async getTemplate(
    @Param() params: TemplateParamsDto,
    @RequestUser() user: UserTokenDto,
  ) {
    const dataset = await this.templateService.findOne({
      userId: user._id,
      templateId: params.id,
    });
    if (!dataset) throw new NotFoundException('Template not found');
    return dataset;
  }

  /**
   * updates the template uploaded for a user
   */
  @Patch(':id')
  @UseInterceptors(TemplateImageFileInterceptor)
  async updateTemplate(
    @UploadedFile() templateFile: Express.Multer.File,
    @Body() body: TemplateUpdateDto,
    @Param() params: TemplateParamsDto,
    @RequestUser() user: UserTokenDto,
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

  /**
   * deletes the user uploaded template
   */
  @Delete(':id')
  async deleteTemplate(
    @Param() params: TemplateParamsDto,
    @RequestUser() user: UserTokenDto,
  ) {
    await this.templateService.remove({
      userId: user._id,
      templateId: params.id,
    });
    return 'Deleted template successfully';
  }
}
