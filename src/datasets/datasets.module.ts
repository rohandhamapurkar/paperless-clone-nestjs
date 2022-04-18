import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
import { Dataset, DatasetSchema } from './entities/dataset';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Dataset.name, schema: DatasetSchema }],
      'paperless-db',
    ),
    CommonModule,
  ],
  controllers: [DatasetsController],
  providers: [DatasetsService],
})
export class DatasetsModule {}
