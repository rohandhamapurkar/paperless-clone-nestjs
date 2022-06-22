import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from 'src/common/common.service';
import { mockCommonService } from 'src/common/__mocks__/common.service.mock';
import { templateImageFileStub, templateStub } from 'test/stubs/template.stub';
import { userStub } from 'test/stubs/user.stub';
import { TemplatesService } from './templates.service';
import { mockTemplateRepository } from './__mocks__/templates.repository.mock';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: CommonService,
          useValue: mockCommonService,
        },
        {
          provide: getModelToken('Template'),
          useValue: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all templates', async () => {
    const mockResult = { data: [templateStub], fetchCount: 1, totalCount: 1 };
    expect(
      await service.findAll({
        userId: userStub._id,
        query: { pageNo: '1', pageSize: '10', searchText: '' },
      }),
    ).toEqual(mockResult);
  });

  it('should return a template', async () => {
    const mockResult = templateStub;
    expect(
      await service.findOne({
        userId: userStub._id,
        templateId: templateStub._id,
      }),
    ).toEqual(mockResult);
  });

  it('should create a template', async () => {
    const mockResult = templateStub;
    expect(
      await service.create({
        file: templateImageFileStub.buffer,
        filename: templateImageFileStub.filename,
        userId: userStub._id,
        name: 'test',
      }),
    ).toEqual(mockResult);
  });

  it('should create a template', async () => {
    const mockResult = templateStub;
    expect(
      await service.create({
        file: templateImageFileStub.buffer,
        filename: templateImageFileStub.filename,
        userId: userStub._id,
        name: 'test',
      }),
    ).toEqual(mockResult);
  });

  it('should update the template', async () => {
    expect(
      await service.update({
        updateObj: { name: 'something', file: templateImageFileStub },
        templateId: templateStub._id,
        userId: userStub._id,
      }),
    ).toEqual(undefined);
  });

  it('should delete the template', async () => {
    expect(
      await service.remove({
        templateId: templateStub._id,
        userId: userStub._id,
      }),
    ).toEqual(undefined);
  });
});
