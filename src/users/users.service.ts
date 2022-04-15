import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersRespository: Model<User>,
  ) {}

  async findOne(username: string) {
    return this.usersRespository.findOne({ username }).exec();
  }
}
