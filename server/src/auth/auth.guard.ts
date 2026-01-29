import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument, UserStatus } from 'src/users/schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from 'src/roles/schemas/role.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cxt = GqlExecutionContext.create(context);
    const request = cxt.getContext().req;

    const authHeader = request.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && request.cookies) {
      token = request.cookies['accessToken'];
    }

    if (!token) {
      return false;
    }

    try {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const decoded: any = jwt.verify(token, tokenSecret!);

      if (!decoded._id || !decoded.organizationId) {
        return false;
      }

      const user = await this.userModel
        .findOne({
          _id: new Types.ObjectId(decoded._id),
          organizationId: new Types.ObjectId(decoded.organizationId),
        })
        .populate({ path: 'role', model: Roles.name })
        .lean();

      if (!user) {
        console.log('AuthGuard Failed: User not found in DB');
        return false;
      }

      // console.log('AuthGuard Success: User found', user._id);

      const status = user.status?.toUpperCase();
      if (status !== 'ACTIVE') {
        console.log('AuthGuard Failed: User not active', user.status);
        return false;
      }

      request.user = user;
      return true;
    } catch (e) {
      console.log('Auth Error Full:', e); // Detailed error
      console.log('Token that failed:', token);
      console.log(
        'Secret used:',
        process.env.ACCESS_TOKEN_SECRET ? 'Exists' : 'Missing',
      );
      return false;
    }
  }
}
