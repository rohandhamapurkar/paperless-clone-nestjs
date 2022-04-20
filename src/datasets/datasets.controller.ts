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
import { User } from 'src/auth/decorators/user.decorator';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DatasetsService } from './datasets.service';
import { DatasetParamsDto } from './dto/dataset-params.dto';
import { UploadReqBodyDto } from './dto/upload-req.dto';
import { DatasetFileInterceptor } from './interceptors/dataset-file.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetService: DatasetsService) {}
  @Post()
  @UseInterceptors(DatasetFileInterceptor)
  async createDataset(
    @UploadedFile() datasetFile: Express.Multer.File,
    @Body() body: UploadReqBodyDto,
    @User() user: UserPayloadDto,
  ) {
    await this.datasetService.create({
      file: datasetFile.buffer,
      datasetName: body.name,
      userId: user._id,
    });

    return 'Dataset created successfully';
  }

  @Get()
  async getDatasets(@User() user: UserPayloadDto) {
    return await this.datasetService.findAll(user._id);
  }

  @Get(':id')
  async getDataset(
    @User() user: UserPayloadDto,
    @Param() params: DatasetParamsDto,
  ) {
    const dataset = await this.datasetService.findOne({
      userId: user._id,
      datasetId: params.id,
    });
    if (!dataset) throw new NotFoundException('Dataset not found');
    return dataset;
  }

  @Delete(':id')
  async deleteDataset(
    @User() user: UserPayloadDto,
    @Param() params: DatasetParamsDto,
  ) {
    await this.datasetService.remove({
      userId: user._id,
      datasetId: params.id,
    });
    return 'Deleted dataset successfully';
  }
}
