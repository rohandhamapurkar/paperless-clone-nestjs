import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
      fileFilter: (req, file, callback) => {
        const ext = file.originalname ? file.originalname.split('.')[1] : '';
        if (!FILE_UPLOAD_ALLOWED_EXTENSIONS.includes(ext)) {
          callback(new Error('Invalid file extension'), false);
        }
        callback(null, true);
      },
    }),
  )
  async postDataset(
    @UploadedFile() datasetFile: Express.Multer.File,
    @Body() body: UploadReqBodyDto,
    @User() user: UserPayloadDto,
  ) {
    // const top = new RowsDto();
    // top.rows = [{ name: 'test' }, { name: 'test' }, { name: 'test' }];
    // if (!datasetFile) {
    //   throw new NotFoundException("Form data doesn't contain any file.");
    // }
    // const dataset = await this.datasetService.create(body.name, user._id);
  }

  //   @Get()
  //   getDatasets() {

  //   }

  //   @Get(':id')
  //   getDataset() {

  //   }

  //   @Delete(':id')
  //   deleteDataset() {

  //   }
}
