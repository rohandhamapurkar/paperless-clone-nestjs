import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OtpSession {
  @Prop({ required: true })
  otp: string;
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  createdOn: Date;
}

const OtpSessionSchema = SchemaFactory.createForClass(OtpSession);
OtpSessionSchema.index({ username: 1 }, { unique: true });
OtpSessionSchema.index({ createdOn: 1 }, { expireAfterSeconds: 300 });

export { OtpSessionSchema };
