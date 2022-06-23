import { datasetRowsStub, datasetStub } from 'test/stubs/dataset.stub';

export const mockDatasetRepository = {
  countDocuments: async () => 1,
  find: async () => {
    return [datasetStub];
  },
  findOne: async () => datasetStub,
  create: async () => datasetStub,
  updateOne: async () => ({
    matchedCount: 1,
    acknowledged: 1,
  }),
  findOneAndDelete: async () => datasetStub,
};

export const mockDatasetDbConnection = {
  collection: () => {
    return {
      find: () => ({
        toArray: () => datasetRowsStub,
      }),
    };
  },
};
