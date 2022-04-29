type Row = Record<string, string | number>;

/**
 * For excel json row validation
 */
export class ExcelRowDto {
  obj: Row;
}
