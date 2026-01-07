import { BadRequestException, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { UserDocument, User } from 'src/users/schemas/userSchema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  generateRefreshToken(_id: Types.ObjectId, orgId: Types.ObjectId) {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        'REFRESH_TOKEN_SECRET is not defined in environment variables',
      );
    }
    const refreshToken = jwt.sign(
      { _id: _id.toString(), organizationId: orgId.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '30d',
      },
    );
    return refreshToken;
  }

  generateAccessToken(_id: Types.ObjectId, orgId: Types.ObjectId) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not defined in environment variables',
      );
    }
    const accessToken = jwt.sign(
      { _id: _id.toString(), organizationId: orgId.toString() },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      },
    );
    return accessToken;
  }


  async updateRefreshToken(
    _id: Types.ObjectId,
    refreshToken: string,
    organizationId: Types.ObjectId,
    session?: ClientSession,
  ) {
    const result = await this.userModel.updateOne(
      { _id, organizationId },
      { $set: { refreshToken } },
      session ?{ session }:undefined,
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('User not found');
    }
  }

  async SaveRefreshToken(
    _id: Types.ObjectId,
    refreshToken: string,
    organizationId: Types.ObjectId,
    session?: ClientSession,
  ) {
    const result = await this.userModel.updateOne(
      { _id, organizationId },
      { $set: { refreshToken } },
      session ?{ session }:undefined,
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('User not found');
    }
  }

  async DeleteRefreshToken(_id:Types.ObjectId, organizationId:Types.ObjectId){
    await this.userModel.updateOne(
      { _id, organizationId },
      { $set: { refreshToken: null } },
    );
    return true;
  }
}
