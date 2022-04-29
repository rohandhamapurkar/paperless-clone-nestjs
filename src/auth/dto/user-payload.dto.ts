import mongoose from 'mongoose';

/**
 * UserPayloadDto is data entity for user object on request instance
 */
export class UserPayloadDto {
  'id': mongoose.Types.ObjectId;
  '_id': mongoose.Types.ObjectId;
  'username': string;
  'type': number;
}
