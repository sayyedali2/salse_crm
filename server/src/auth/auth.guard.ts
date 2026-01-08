import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from 'src/users/schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cxt = GqlExecutionContext.create(context);
    const request = cxt.getContext().req;

    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];

    try{
      const tokenSecret =  process.env.ACCESS_TOKEN_SECRET
      const decoded: any = jwt.verify(token, tokenSecret!);

      if(!decoded._id || !decoded.organizationId){
        return false;
      }

      const user = await this.userModel.findOne({_id: new Types.ObjectId(decoded._id), organizationId: new Types.ObjectId(decoded.organizationId)}).populate('role').lean();

      if (!user || user.status !== 'Active') {
        return false;
      }

      request.user = user;
      return true;
    }catch (e) {
      console.log('Auth Error:', e.message);
      return false;
    }

  }
}
