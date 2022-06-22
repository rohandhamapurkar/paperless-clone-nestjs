import { Logger } from '@nestjs/common';
import { templateStub } from 'test/stubs/template.stub';
import { Template } from '../entities/template.entity';

const logger = new Logger('MockTemplateService');

export const mockTemplateService = {
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
    return [templateStub];
  },
  findOne: (): Template => {
    return templateStub;
  },
};
