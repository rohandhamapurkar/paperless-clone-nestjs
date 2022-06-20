import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Stream } from 'stream';
import { Template } from './entities/template.entity';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

const logger = new Logger('TemplatesTestSuite');

describe('TemplatesController', () => {
  let controller: TemplatesController;

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
  const mockUser = {
    iss: 'string',
    _id: 'string',
    sub: 'string',
    aud: ['string'],
    iat: 100,
    exp: 100,
    azp: 'string',
    scope: 'string',
  };

  const mockTemplate = {
    userId: 'userId',
    name: 'name',
    imageUrl: 'imageUrl',
    createdOn: new Date(),
    updatedOn: new Date(),
  };

  const mockTemplatesService = {
    create: () => {
      logger.debug('mocking creation');
    },
    update: () => {
      logger.debug('mocking update');
    },
    remove: () => {
      logger.debug('mocking delete');
    },
    findAll: (): Template[] => {
      return [mockTemplate];
    },
    findOne: (): Template => {
      return mockTemplate;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: mockTemplatesService,
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a template', async () => {
    expect(
      await controller.createTemplate(
        mockFile,
        { name: 'test.xlsx' },
        mockUser,
      ),
    ).toEqual('Template created successfully');
  });

  it('should get templates', async () => {
    expect(
      await controller.getTemplates(mockUser, {
        pageNo: '1',
        pageSize: '10',
        searchText: '',
      }),
    ).toEqual([mockTemplate]);
  });

  it('should update template', async () => {
    expect(
      await controller.updateTemplate(
        mockFile,
        { name: 'updatedName' },
        { id: 'templateId' },
        mockUser,
      ),
    ).toEqual('Updated template successfully');
  });

  it('delete a template', async () => {
    expect(
      await controller.deleteTemplate({ id: 'templateId' }, mockUser),
    ).toEqual('Deleted template successfully');
  });
});
