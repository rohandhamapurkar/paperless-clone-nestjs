import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { Template } from './entities/template';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateRepository: mongoose.Model<Template>,
    private readonly commonService: CommonService,
  ) {}

  findAll(userId: mongoose.Types.ObjectId) {
    return this.templateRepository.find({ userId });
  }

  findOne({
    userId,
    templateId,
  }: {
    userId: mongoose.Types.ObjectId;
    templateId: string;
  }) {
    return this.templateRepository.findOne({
      userId,
      _id: new mongoose.Types.ObjectId(templateId),
    });
  }

  async create({
    file,
    filename,
    name,
    userId,
  }: {
    file: Buffer;
    filename: string;
    name: string;
    userId: mongoose.Types.ObjectId;
  }) {
    const imageUrl = await this.commonService.uploadImageToImgur({
      filename: filename,
      fileStream: file,
    });

    try {
      const template = await this.templateRepository.create({
        imageUrl,
        name,
        createdOn: new Date(),
        updatedOn: new Date(),
        userId,
      });

      return template.save();
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicate template name found');
      } else {
        throw e;
      }
    }
  }

  async update({
    updateObj,
    templateId,
    userId,
  }: {
    updateObj: any;
    templateId: string;
    userId: mongoose.Types.ObjectId;
  }) {
    if (updateObj.hasOwnProperty('file')) {
      updateObj.imageUrl = await this.commonService.uploadImageToImgur({
        filename: updateObj.filename,
        fileStream: updateObj.file,
      });
      delete updateObj.filename;
      delete updateObj.file;
    }

    if (Object.keys(updateObj).length == 0) {
      throw new BadRequestException('Nothing to update');
    }

    updateObj.updatedOn = new Date();

    const update = await this.templateRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(templateId),
        userId,
      },
      { $set: updateObj },
    );
    if (!update.matchedCount) {
      throw new BadRequestException('Could not find template');
    }

    if (!update.acknowledged) {
      throw new ServiceUnavailableException('Could not update template');
    }
  }

  async remove({
    userId,
    templateId,
  }: {
    userId: mongoose.Types.ObjectId;
    templateId: string;
  }) {
    const template = await this.templateRepository.findOneAndDelete({
      userId,
      _id: new mongoose.Types.ObjectId(templateId),
    });

    if (!template) throw new NotFoundException('Template not found');
  }
}
