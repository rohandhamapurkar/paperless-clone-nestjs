import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Dataset Schema is used for defining mongodb collection
 * for storing dataset documents
 */
@Schema()
export class Dataset {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdOn: Date;
}

const DatasetSchema = SchemaFactory.createForClass(Dataset);
DatasetSchema.index({ name: 1, userId: 1 }, { unique: true });
export { DatasetSchema };
