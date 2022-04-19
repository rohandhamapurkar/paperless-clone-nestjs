import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import * as xlsx from 'xlsx';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class CommonService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  xlsxToJson(file: Buffer): Readable {
    const workbook = xlsx.read(file, { type: 'buffer' });
    const xlsxSheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxStream = xlsx.stream.to_json(xlsxSheet, {
      raw: true,
      // range: xlsxSheet["!ref"],
    });

    return xlsxStream;
  }

  async uploadImageToImgur({
    filename,
    fileStream,
  }: {
    filename: string;
    fileStream: any;
  }) {
    const data = new FormData();
    data.append('image', fileStream);
    data.append('name', filename);

    const response = await this.httpService
      .post('https://api.imgur.com/3/upload', data, {
        headers: {
          Authorization:
            'Client-ID ' + this.configService.get<string>('IMGUR_CLIENT_ID'),
          ...data.getHeaders(),
        },
      })
      .pipe(map((response) => response.data));

    console.log(response);

    return {
      ok: true,
      publicLink: '',
    };
  }
}
