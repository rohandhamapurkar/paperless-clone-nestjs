import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as xlsx from 'xlsx';
@Injectable()
export class CommonService {
  xlsxToJson(file: Buffer): Readable {
    const workbook = xlsx.read(file, { type: 'buffer' });
    const xlsxSheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxStream = xlsx.stream.to_json(xlsxSheet, {
      raw: true,
      // range: xlsxSheet["!ref"],
    });

    return xlsxStream;
  }
}
