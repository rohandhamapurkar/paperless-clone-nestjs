import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Template Schema is used for defining mongodb collection
 * for storing template documents
 */
@Schema()
export class Template {
  @Prop({ required: true })
  userId: string;

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
