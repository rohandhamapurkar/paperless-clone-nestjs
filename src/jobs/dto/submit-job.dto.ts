import { IsString, IsDefined } from 'class-validator';
import { DATA_CONFIG_TYPES } from '../constants';
import { Type } from 'class-transformer';
import { IsObjectId } from 'src/common/decorators/isobjectid.decorator';

class FabricObjectPosition {
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  left?: number;
  top?: number;
}

class FabricObjectStyle {
  originX?: string | undefined;
  originY?: string | undefined;
  height?: number | undefined;
  color?: string | undefined;
  backgroundColor?: string | undefined;
  fontFamily?: string | undefined;
  fontWeight?: string | number | undefined;
  fontSize?: number | undefined;
  underline?: boolean | undefined;
  strikeThrough?: boolean | undefined;
  horizontalAlignment?: string | undefined;
  fontStyle?: '' | 'normal' | 'italic' | 'oblique' | undefined;
}

class FabricImageAttribute {
  angle: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
}

class DataConfigType {
  type: DATA_CONFIG_TYPES;
  datasetId?: string;
  dataField?: string;
  url?: string;
  scale?: number;
  attributes?: FabricImageAttribute;
  position: FabricObjectPosition;
  style?: FabricObjectStyle;
  text?: string;
}

export class SubmitJobDto {
  @IsDefined()
  @Type(() => DataConfigType)
  dataConfig: DataConfigType;

  @IsObjectId()
  @IsString()
  @IsDefined()
  templateId: string;
}
