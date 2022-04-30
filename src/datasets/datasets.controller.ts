import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DatasetsService } from './datasets.service';
import { DatasetParamsDto } from './dto/dataset-params.dto';
import { UploadReqBodyDto } from './dto/upload-req.dto';
import { DatasetFileInterceptor } from './interceptors/dataset-file.interceptor';

@UseGuards(AuthGuard('jwt'))
@Controller('datasets')
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
  ) {
    // await this.datasetService.create({
    //   file: datasetFile.buffer,
    //   datasetName: body.name,
    //   userId: user._id,
    // });

    return 'Dataset created successfully';
  }

  /**
   * Endpoint for getting all uploaded datasets for a user
   */
  @Get()
  async getDatasets() {
    // return await this.datasetService.findAll(user._id);
  }

  /**
   * Endpoint for getting dataset rows for a dataset
   */
  @Get(':id')
  async getDataset(@Param() params: DatasetParamsDto) {
    // const dataset = await this.datasetService.getDatasetRows({
    //   userId: user._id,
    //   datasetId: params.id,
    // });
    // return dataset;
  }

  /**
   * Endpoint deleting user uploaded dataset
   */
  @Delete(':id')
  async deleteDataset(@Param() params: DatasetParamsDto) {
    // await this.datasetService.remove({
    //   userId: user._id,
    //   datasetId: params.id,
    // });
    // return 'Deleted dataset successfully';
  }
}
