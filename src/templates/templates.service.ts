import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    // inject template model for operations with template collection
    @InjectModel(Template.name)
    private readonly templateRepository: mongoose.Model<Template>,
    private readonly commonService: CommonService,
  ) {}

  /**
   * To get all templates for a user from the database
   */
  async findAll({ userId, query }: { userId: string; query: PaginationDto }) {
    const filter = {
      userId,
      ...(query.searchText !== '' && {
        name: this.commonService.createSearchRegex(query.searchText),
      }),
    };
    const data = await this.templateRepository.find(
      filter,
      {},
      { skip: (+query.pageNo - 1) * +query.pageSize, limit: +query.pageSize },
    );

    return {
      data,
      fetchCount: await this.templateRepository.countDocuments(filter),
      totalCount: await this.templateRepository.countDocuments({ userId }),
    };
  }

  /**
   * To get single template for a user from the database
   */
  findOne({ userId, templateId }: { userId: string; templateId: string }) {
    return this.templateRepository.findOne({
      userId,
      _id: new mongoose.Types.ObjectId(templateId),
    });
  }

  /**
   * To upload image to imgur and create a template
   */
  async create({
    file,
    filename,
    name,
    userId,
  }: {
    file: Buffer;
    filename: string;
    name: string;
    userId: string;
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

  /**
   * Updates the user template
   */
  async update({
    updateObj,
    templateId,
    userId,
  }: {
    updateObj: any;
    templateId: string;
    userId: string;
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

  /**
   * Deletes the user template from database
   */
  async remove({ userId, templateId }: { userId: string; templateId: string }) {
    const template = await this.templateRepository.findOneAndDelete({
      userId,
      _id: new mongoose.Types.ObjectId(templateId),
    });

    if (!template) throw new NotFoundException('Template not found');
  }
}
