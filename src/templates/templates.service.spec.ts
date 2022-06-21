import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from 'src/common/common.service';
import { Stream } from 'stream';
import { Template } from './entities/template.entity';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  const templateId = '61632f59405d4e410947991f';
  const userId = '61632f59405d4e410947991d';
  const mockFile = {
    fieldname: 'string',
    originalname: 'string',
    encoding: 'string',
    mimetype: 'string',
    size: 5000,
    stream: new Stream.Readable(),
    destination: 'string',
    filename: 'string',
    path: 'string',
    buffer: Buffer.from('test', 'utf8'),
  };
  const mockCommonService = {
    uploadImageToImgur: async () => {
      return 'https://imgur-image-url/';
    },
  };
  const mockTemplates: Template[] = [
    {
      userId: '61632f59405d4e410947991d',
      name: 'name',
      imageUrl: 'https://imgur-image-url/',
      createdOn: new Date(),
      updatedOn: new Date(),
    },
  ];
  const mockTemplateRepository = {
    countDocuments: async () => mockTemplates.length,
    find: async () => {
      return mockTemplates;
    },
    findOne: async () => mockTemplates[0],
    create: async () => mockTemplates[0],
  };

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
    const mockResult = { data: mockTemplates, fetchCount: 1, totalCount: 1 };
    expect(
      await service.findAll({
        userId: userId,
        query: { pageNo: '1', pageSize: '10', searchText: '' },
      }),
    ).toEqual(mockResult);
  });

  it('should return a template', async () => {
    const mockResult = mockTemplates[0];
    expect(
      await service.findOne({
        userId: userId,
        templateId: templateId,
      }),
    ).toEqual(mockResult);
  });

  it('should create a template', async () => {
    const mockResult = mockTemplates[0];
    expect(
      await service.create({
        file: mockFile.buffer,
        filename: mockFile.filename,
        userId,
        name: 'test',
      }),
    ).toEqual(mockResult);
  });
});
