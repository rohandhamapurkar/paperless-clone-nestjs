import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { DatasetsService } from './datasets.service';
import { DatasetParamsDto } from './dto/dataset-params.dto';
import { UploadReqBodyDto } from './dto/upload-req.dto';
import { DatasetFileInterceptor } from './interceptors/dataset-file.interceptor';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('datasets')
@Permissions('crud:datasets')
export class DatasetsController {
  constructor(private readonly datasetService: DatasetsService) {}

  /**
   * Endpoint for dataset creation using file upload
   */
  @Post()
  @UseInterceptors(DatasetFileInterceptor)
  async createDataset(
    @UploadedFile() datasetFile: Express.Multer.File,
    @Body() body: UploadReqBodyDto,
    @RequestUser() user: UserTokenDto,
  ) {
    if (!datasetFile) throw new NotFoundException('Uploaded File not found');
    await this.datasetService.create({
      file: datasetFile.buffer,
      datasetName: body.name,
      userId: user._id,
    });

    return 'Dataset created successfully';
  }

  /**
   * Endpoint for getting all uploaded datasets for a user
   */
  @Get()
  async getDatasets(@RequestUser() user: UserTokenDto) {
    return await this.datasetService.findAll(user._id);
  }

  /**
   * Endpoint for getting dataset rows for a dataset
   */
  @Get(':id')
  async getDataset(
    @Param() params: DatasetParamsDto,
    @RequestUser() user: UserTokenDto,
  ) {
    const dataset = await this.datasetService.getDatasetRows({
      userId: user._id,
      datasetId: params.id,
    });
    return dataset;
  }

  /**
   * Endpoint deleting user uploaded dataset
   */
  @Delete(':id')
  async deleteDataset(
    @Param() params: DatasetParamsDto,
    @RequestUser() user: UserTokenDto,
  ) {
    await this.datasetService.remove({
      userId: user._id,
      datasetId: params.id,
    });
    return 'Deleted dataset successfully';
  }
}
