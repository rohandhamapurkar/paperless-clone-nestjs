import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './entities/template';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Template.name, schema: TemplateSchema }],
      'paperless-db',
    ),
    CommonModule,
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
