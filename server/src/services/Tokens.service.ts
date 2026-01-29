import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { UserDocument, User } from 'src/users/schemas/userSchema';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
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
        expiresIn: '15d',
      },
    );
    return accessToken;
  }

  async SaveRefreshToken(
    _id: Types.ObjectId,
    refreshToken: string,
    organizationId: Types.ObjectId,
  ) {
    const result = await this.userModel.updateOne(
      { _id, organizationId },
      { $set: { refreshToken } },
    );

    if (result.matchedCount === 0) {
      throw new BadRequestException('User not found');
    }
  }

  async DeleteRefreshToken(
    _id: Types.ObjectId,
    organizationId: Types.ObjectId,
  ) {
    await this.userModel.updateOne(
      { _id, organizationId },
      { $set: { refreshToken: null } },
    );
    return true;
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
  }
}
