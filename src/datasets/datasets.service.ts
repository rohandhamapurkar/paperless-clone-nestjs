import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Dataset } from './entities/dataset';
import mongoose from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset.name)
    private readonly datasetRepository: mongoose.Model<Dataset>,
  ) {}
  // private readonly commonService: CommonService, // @InjectConnection() private readonly connection: mongoose.Connection,

  async create(name: string, userId: mongoose.Types.ObjectId) {
    const dataset = await this.datasetRepository.create({
      name,
      userId,
      createdOn: new Date(),
    });
    return dataset.save();
  }

  async insertFromXlsx(filepath: string) {
    // create a tempCollection Name
    // const tempCollectionName = `temp_${uuidv4()}`;
    // const jsonStream = this.commonService.xlsxToJson(filepath);
    // const promiseArr = [];
    // jsonStream.on('error', function (e) {
    //   console.error(e);
    //   throw new ServiceUnavailableException('Error while reading file');
    // });
  }
}
