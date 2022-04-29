import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Readable, Stream } from 'stream';
import * as xlsx from 'xlsx';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
const logger = new Logger('CommonService');
@Injectable()
export class CommonService {
  constructor(
    // config service for environment variables
    private readonly configService: ConfigService,
    // http service to make an api call
    private readonly httpService: HttpService,
  ) {}

  /**
   * Converts input xlsx file buffer to json data stream
   */
  xlsxToJson(file: Buffer): Readable {
    const workbook = xlsx.read(file, { type: 'buffer' });
    const xlsxSheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxStream = xlsx.stream.to_json(xlsxSheet, {
      raw: true,
      // range: xlsxSheet["!ref"],
    });

    return xlsxStream;
  }

  /**
   * Uploads the input file stream to Imgur
   */
  async uploadImageToImgur({
    filename,
    fileStream,
  }: {
    filename: string;
    fileStream: Buffer | Stream;
  }): Promise<string> {
    const data = new FormData();
    data.append('image', fileStream, { filename: filename });

    const response = this.httpService.post(
      'https://api.imgur.com/3/upload',
      data,
      {
        headers: {
          'Content-Length': data.getLengthSync(),
          Authorization:
            'Client-ID ' + this.configService.get<string>('IMGUR_CLIENT_ID'),
          ...data.getHeaders(),
        },
      },
    );

    const result = await firstValueFrom(
      response.pipe(
        catchError((e) => {
          logger.error(e.response.data);
          throw new ServiceUnavailableException(
            'Could not upload image to Imgur',
          );
        }),
        map((response) => {
          return response.data;
        }),
      ),
    );

    if (result.status == 200 && result.data.link != '') {
      return result.data.link;
    } else {
      throw new ServiceUnavailableException('Could not upload image to Imgur');
    }
  }
}
