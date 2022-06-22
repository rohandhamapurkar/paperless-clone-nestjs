import { Test, TestingModule } from '@nestjs/testing';
import { templateImageFileStub, templateStub } from 'test/stubs/template.stub';
import { userStub } from 'test/stubs/user.stub';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { mockTemplateService } from './__mocks__/templates.service.mock';

describe('TemplatesController', () => {
  let controller: TemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: mockTemplateService,
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
        templateImageFileStub,
        { name: 'test.xlsx' },
        userStub,
      ),
    ).toEqual('Template created successfully');
  });

  it('should get templates', async () => {
    expect(
      await controller.getTemplates(userStub, {
        pageNo: '1',
        pageSize: '10',
        searchText: '',
      }),
    ).toEqual([templateStub]);
  });

  it('should update template', async () => {
    expect(
      await controller.updateTemplate(
        templateImageFileStub,
        { name: 'updatedName' },
        { id: templateStub._id },
        userStub,
      ),
    ).toEqual('Updated template successfully');
  });

  it('delete a template', async () => {
    expect(
      await controller.deleteTemplate({ id: templateStub._id }, userStub),
    ).toEqual('Deleted template successfully');
  });
});
