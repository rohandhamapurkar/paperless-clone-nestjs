import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { User, UserType } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    // inject user model for operations with users collection
    @InjectModel(User.name) private readonly usersRespository: Model<User>,
  ) {}

  /**
   * Fetches single user from the database on username
   */
  async findOne(username: string) {
    return this.usersRespository.findOne({ username }).exec();
  }

  /**
   * Inserts a user doc in the users collection
   */
  async create(
    user: { username: string; password: string },
    session?: mongoose.ClientSession,
  ) {
    const userDocument = await this.usersRespository.create(
      [{ ...user, type: UserType.USER }],
      { session },
    );

    return userDocument[0].save({ session });
  }
}
