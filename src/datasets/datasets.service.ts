import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Dataset } from './entities/dataset.entity';
import mongoose from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { ExcelRowDto } from './dto/excel-row.dto';
import { validate } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
const logger = new Logger('DatasetsService');
@Injectable()
export class DatasetsService {
  constructor(
    // inject dataset model for operations with dataset collection
    @InjectModel(Dataset.name)
    private readonly datasetRepository: mongoose.Model<Dataset>,
    // common service dependency
    private readonly commonService: CommonService,
    // inject dataset database connection for dataset rows collection
    @InjectConnection('datasets-db')
    private readonly connection: mongoose.Connection,
  ) {}

  /**
   * To get all datasets uploaded by a user
   */
  async findAll({ userId, query }: { userId: string; query: PaginationDto }) {
    const filter = {
      userId,
      ...(query.searchText !== '' && {
        name: this.commonService.createSearchRegex(query.searchText),
      }),
    };
    const data = await this.datasetRepository.find(
      filter,
      {},
      { skip: +query.pageNo * +query.pageSize, limit: +query.pageSize },
    );
    return {
      data,
      fetchCount: await this.datasetRepository.countDocuments(filter),
      totalCount: await this.datasetRepository.countDocuments(),
    };
  }

  /**
   * Get limited dataset rows for a dataset uploaded for a user
   */
  async getDatasetRows({
    userId,
    datasetId,
  }: {
    userId: string;
    datasetId: string;
  }) {
    const dataset = await this.datasetRepository.findOne({
      userId,
      _id: new mongoose.Types.ObjectId(datasetId),
    });
    if (!dataset) throw new NotFoundException('Dataset not found');

    return this.connection
      .collection(String(dataset._id))
      .find({}, { limit: 20 })
      .toArray();
  }

  /**
   * Uploads the xlsx file and insert dataset and dataset rows in the database
   */
  create({
    file,
    datasetName,
    userId,
  }: {
    file: Buffer;
    datasetName: string;
    userId: string;
  }): Promise<null> {
    return new Promise(async (resolve, reject) => {
      let session: mongoose.ClientSession;
      try {
        session = await this.connection.startSession();
        const jsonStream = this.commonService.xlsxToJson(file);
        const promiseArr: Promise<void>[] = [];

        await session.startTransaction();

        const dataset = await this.datasetRepository.create(
          [
            {
              name: datasetName,
              userId,
              createdOn: new Date(),
            },
          ],
          { session },
        );
        const result = await dataset[0].save({ session });
        const collectionName = String(result._id);

        jsonStream.on('error', async (e) => {
          logger.error(e);
          reject(new ServiceUnavailableException('Error while reading file'));
          await session.abortTransaction();
          await session.endSession();
          jsonStream.destroy();
        });

        // stream on each data row recieved try building the finalObj and insert into the tempCollection
        jsonStream.on('data', async (obj) => {
          return promiseArr.push(
            this.buildDatasetRow({ obj, session, collectionName }),
          );
        });

        jsonStream.on('end', async () => {
          try {
            await Promise.all(promiseArr);
          } catch (e) {
            reject(e);
            jsonStream.destroy();
            await session.abortTransaction();
            return await session.endSession();
          }
          await session.commitTransaction();
          await session.endSession();
          resolve(null);
        });
      } catch (e) {
        if (e.code === 11000) {
          reject(new BadRequestException('Duplicate dataset name found'));
        } else {
          reject(e);
        }
        await session.abortTransaction();
        await session.endSession();
      }
    });
  }

  /**
   * Removes the dataset entry and all dataset rows for a user uploaded dataset
   */
  async remove({ userId, datasetId }: { userId: string; datasetId: string }) {
    const session = await this.connection.startSession();
    try {
      await session.startTransaction();
      const dataset = await this.datasetRepository.findOneAndDelete(
        {
          userId,
          _id: new mongoose.Types.ObjectId(datasetId),
        },
        { session },
      );

      if (!dataset) throw new NotFoundException('Dataset not found');
      await this.connection
        .collection(String(dataset._id))
        .deleteMany({}, { session });

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Used to build the final object which will be inserted in the collection which contains the dataset rows
   */
  async buildDatasetRow({
    obj,
    session,
    collectionName,
  }: {
    obj: any;
    session: mongoose.ClientSession;
    collectionName: string;
  }) {
    const opts = { session };
    const dto = new ExcelRowDto();
    dto.obj = obj;
    const errors = await validate(dto);
    if (errors.length != 0)
      throw new BadRequestException(`Invalid data row, ${JSON.stringify(obj)}`);
    const insertionResult = await this.connection
      .collection(collectionName)
      .insertOne({ ...dto.obj }, opts);
    if (!insertionResult.acknowledged) {
      throw new ServiceUnavailableException('Database insertion failed');
    }
  }
}
