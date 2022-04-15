import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserType {
  USER = 30,
  ADMIN = 10,
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  type: UserType.USER | UserType.ADMIN;
}

export const UserSchema = SchemaFactory.createForClass(User);
