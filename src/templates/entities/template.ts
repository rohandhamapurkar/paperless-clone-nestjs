import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Template {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  createdOn: Date;

  @Prop({ required: true })
  updatedOn: Date;
}

const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.index({ name: 1, userId: 1 }, { unique: true });
export { TemplateSchema };
