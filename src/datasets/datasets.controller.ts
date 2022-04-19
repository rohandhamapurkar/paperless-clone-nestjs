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
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/decorators/user.decorator';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FILE_UPLOAD_ALLOWED_EXTENSIONS } from './constants';
import { DatasetsService } from './datasets.service';
import { DatasetParamDto } from './dto/dataset-param.dto';
import { UploadReqBodyDto } from './dto/upload-req.dto';

@UseGuards(JwtAuthGuard)
@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetService: DatasetsService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
      fileFilter: (_, file, callback) => {
        const ext = file.originalname ? file.originalname.split('.')[1] : '';
        if (!FILE_UPLOAD_ALLOWED_EXTENSIONS.includes(ext)) {
          callback(new Error('Invalid file extension'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createDataset(
    @UploadedFile() datasetFile: Express.Multer.File,
    @Body() body: UploadReqBodyDto,
    @User() user: UserPayloadDto,
  ) {
    if (!datasetFile) {
      throw new NotFoundException("Form data doesn't contain any file.");
    }

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
    @Param() params: DatasetParamDto,
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
    @Param() params: DatasetParamDto,
  ) {
    await this.datasetService.remove({
      userId: user._id,
      datasetId: params.id,
    });
    return 'Deleted dataset successfully';
  }
}
