import { Injectable } from '@nestjs/common';
import { Stream } from 'stream';
import xlsx from 'xlsx';
@Injectable()
export class CommonService {
  xlsxToJson(filepath: string): Stream {
    const workbook = xlsx.readFile(filepath);
    const xlsxSheet = workbook.Sheets[workbook.SheetNames[0]];
    const xlsxStream = xlsx.stream.to_json(xlsxSheet, {
      raw: true,
      // range: xlsxSheet["!ref"],
    });

    return xlsxStream;
  }
}
