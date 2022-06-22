import { templateStub } from 'test/stubs/template.stub';

export const mockTemplateRepository = {
  countDocuments: async () => 1,
  find: async () => {
    return [templateStub];
  },
  findOne: async () => templateStub,
  create: async () => templateStub,
  updateOne: async () => ({
    matchedCount: 1,
    acknowledged: 1,
  }),
  findOneAndDelete: async () => templateStub,
};
