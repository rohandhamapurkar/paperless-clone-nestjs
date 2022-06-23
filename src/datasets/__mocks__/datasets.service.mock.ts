import { datasetRowsStub, datasetStub } from 'test/stubs/dataset.stub';

export const mockDatasetService = {
  create: () => {
    // Logger.debug('creating dataset');
  },
  remove: () => {
    // Logger.debug('removing dataset');
  },
  findAll: () => ({
    data: [datasetStub],
    totalCount: 1,
    fetchCount: 1,
  }),
  getDatasetRows: () => datasetRowsStub,
};
