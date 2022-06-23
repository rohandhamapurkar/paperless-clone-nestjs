import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from 'src/common/common.service';
import { mockCommonService } from 'src/common/__mocks__/common.service.mock';
import { datasetRowsStub, datasetStub } from 'test/stubs/dataset.stub';
import { paginationStub, userStub } from 'test/stubs/user.stub';
import { DatasetsService } from './datasets.service';
import {
  mockDatasetDbConnection,
  mockDatasetRepository,
} from './__mocks__/datasets.repository.mock';

describe('DatasetsService', () => {
  let service: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatasetsService,
        { provide: getModelToken('Dataset'), useValue: mockDatasetRepository },
        {
          provide: getConnectionToken('datasets-db'),
          useValue: mockDatasetDbConnection,
        },
        {
          provide: CommonService,
          useValue: mockCommonService,
        },
      ],
    }).compile();

    service = module.get<DatasetsService>(DatasetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all datasets', async () => {
    const result = { data: [datasetStub], fetchCount: 1, totalCount: 1 };
    expect(
      await service.findAll({ userId: userStub._id, query: paginationStub }),
    ).toEqual(result);
  });

  it('should get all dataset rows', async () => {
    const result = datasetRowsStub;
    expect(
      await service.getDatasetRows({
        userId: userStub._id,
        datasetId: datasetStub._id,
      }),
    ).toEqual(result);
  });

  it('should get all dataset rows', async () => {
    const result = datasetRowsStub;
    expect(
      await service.getDatasetRows({
        userId: userStub._id,
        datasetId: datasetStub._id,
      }),
    ).toEqual(result);
  });
});
