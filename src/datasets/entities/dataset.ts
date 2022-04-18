import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Dataset {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  name: string;

  @Prop()
  createdOn: Date;
}

const DatasetSchema = SchemaFactory.createForClass(Dataset);
DatasetSchema.index({ name: 1 }, { unique: true });
export { DatasetSchema };
