import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Dataset } from './entities/dataset';
import mongoose from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { ExcelRowDto } from './dto/excel-row.dto';
import { validate } from 'class-validator';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel(Dataset.name)
    private readonly datasetRepository: mongoose.Model<Dataset>,
    private readonly commonService: CommonService,
    @InjectConnection('datasets-db')
    private readonly connection: mongoose.Connection,
  ) {}

  async create(name: string, userId: mongoose.Types.ObjectId) {
    try {
      const dataset = await this.datasetRepository.create({
        name,
        userId,
        createdOn: new Date(),
      });
      return await dataset.save();
    } catch (e) {
      if (e.code == 11000) {
        throw new BadRequestException('Duplicate dataset name found');
      } else {
        throw new ServiceUnavailableException(
          'Something wrong with the database please try again.',
        );
      }
    }
  }

  insertFromXlsx({
    file,
    datasetId,
  }: {
    file: Buffer;
    datasetId: mongoose.Types.ObjectId;
  }): Promise<null> {
    return new Promise(async (resolve, reject) => {
      // create a tempCollection Name
      const tempCollectionName = String(datasetId); //`temp_${uuidv4()}`;
      const jsonStream = this.commonService.xlsxToJson(file);
      const promiseArr: Promise<void>[] = [];

      const session = await this.connection.startSession();
      await session.startTransaction();
      jsonStream.on('error', async (e) => {
        console.error(e);
        reject(new ServiceUnavailableException('Error while reading file'));
        await session.abortTransaction();
        jsonStream.destroy();
      });

      // stream on each data row recieved try building the finalObj and insert into the tempCollection
      jsonStream.on('data', async (obj) => {
        return promiseArr.push(
          this.buildDatasetRow({ obj, session, tempCollectionName }),
        );
      });

      jsonStream.on('end', async () => {
        try {
          await Promise.all(promiseArr);
        } catch (e) {
          reject(e);
          jsonStream.destroy();
          return await session.abortTransaction();
        }
        await session.commitTransaction();
        resolve(null);
      });
    });
  }

  /**
   * buildDatasetRow
   * used to build the final object which will be inserted in the temporary collection
   */
  async buildDatasetRow({
    obj,
    session,
    tempCollectionName,
  }: {
    obj: any;
    session: mongoose.ClientSession;
    tempCollectionName: string;
  }) {
    const opts = { session };
    const dto = new ExcelRowDto();
    dto.name = obj.name;
    const errors = await validate(dto);
    if (errors.length != 0) throw new BadRequestException('Invalid data');
    const insertionResult = await this.connection
      .collection(tempCollectionName)
      .insertOne(dto, opts);
    if (!insertionResult.acknowledged) {
      throw new ServiceUnavailableException('Database insertion failed');
    }
  }
}
