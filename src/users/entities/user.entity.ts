import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserType {
  USER = 30,
  ADMIN = 10,
}

/**
 * User Schema is used for defining mongodb collection
 * for storing user documents
 */
@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  type: UserType.USER | UserType.ADMIN;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
export { UserSchema };
