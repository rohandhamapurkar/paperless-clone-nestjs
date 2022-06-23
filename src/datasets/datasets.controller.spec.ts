import { Test, TestingModule } from '@nestjs/testing';
import {
  datasetFileStub,
  datasetRowsStub,
  datasetStub,
} from 'test/stubs/dataset.stub';
import { paginationStub, userStub } from 'test/stubs/user.stub';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
import { mockDatasetService } from './__mocks__/datasets.service.mock';

describe('DatasetsController', () => {
  let controller: DatasetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetsController],
      providers: [{ provide: DatasetsService, useValue: mockDatasetService }],
    }).compile();

    controller = module.get<DatasetsController>(DatasetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create dataset', async () => {
    expect(
      await controller.createDataset(
        datasetFileStub,
        { name: 'test-dataset' },
        userStub,
      ),
    ).toEqual('Dataset created successfully');
  });

  it('should get all datasets', async () => {
    const result = { data: [datasetStub], totalCount: 1, fetchCount: 1 };
    expect(await controller.getDatasets(userStub, paginationStub)).toEqual(
      result,
    );
  });

  it('should get all dataset rows', async () => {
    const result = datasetRowsStub;
    expect(
      await controller.getDatasetRows({ id: datasetStub._id }, userStub),
    ).toEqual(result);
  });

  it('should delete dataset', async () => {
    expect(
      await controller.deleteDataset({ id: datasetStub._id }, userStub),
    ).toEqual('Deleted dataset successfully');
  });
});
