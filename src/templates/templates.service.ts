import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class TemplatesService {
  constructor(private readonly commonService: CommonService) {}
  async create(file: any) {
    await this.commonService.uploadImageToImgur({
      filename: 'test.png',
      fileStream: file,
    });
  }
}
