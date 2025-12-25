import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt'; // Password hash karne ke liye

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.log('User not found with email:', email);
      return;
    }
    return user;
  }

  async create(email: string, pass: string): Promise<User> {
    // Password ko encrypt karo
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }
}
