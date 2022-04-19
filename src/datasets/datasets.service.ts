import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  findAll(userId: mongoose.Types.ObjectId) {
    return this.datasetRepository.find({ userId });
  }

  findOne({
    userId,
    datasetId,
  }: {
    userId: mongoose.Types.ObjectId;
    datasetId: string;
  }) {
    return this.datasetRepository.findOne({
      userId,
      _id: new mongoose.Types.ObjectId(datasetId),
    });
  }

  create({
    file,
    datasetName,
    userId,
  }: {
    file: Buffer;
    datasetName: string;
    userId: mongoose.Types.ObjectId;
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
          console.error(e);
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

  async remove({
    userId,
    datasetId,
  }: {
    userId: mongoose.Types.ObjectId;
    datasetId: string;
  }) {
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
   * buildDatasetRow
   * used to build the final object which will be inserted in the temporary collection
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
    dto.name = obj.name;
    const errors = await validate(dto);
    if (errors.length != 0)
      throw new BadRequestException(`Invalid data row, ${JSON.stringify(obj)}`);
    const insertionResult = await this.connection
      .collection(collectionName)
      .insertOne(dto, opts);
    if (!insertionResult.acknowledged) {
      throw new ServiceUnavailableException('Database insertion failed');
    }
  }
}
