import mongoose from 'mongoose';

/**
 * UserPayloadDto
 * data entity for request user payload object
 */
export class UserPayloadDto {
  'id': mongoose.Types.ObjectId;
  '_id': mongoose.Types.ObjectId;
  'username': string;
  'type': number;
}
