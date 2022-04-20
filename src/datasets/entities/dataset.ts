import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Dataset {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdOn: Date;
}

const DatasetSchema = SchemaFactory.createForClass(Dataset);
DatasetSchema.index({ name: 1, userId: 1 }, { unique: true });
export { DatasetSchema };
