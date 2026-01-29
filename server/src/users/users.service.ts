import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/userSchema';
import { CreateUserInput } from './dto/createUserInput.dto';
import * as bcrypt from 'bcrypt'; // Password hash karne ke liye
import { CreateAdminUserInput } from './dto/createAdminUserInput.dto';
import { MailService } from 'src/services/mail/mail.service';
import * as crypto from 'crypto';
import { UpdateUserInput } from './dto/updateUserInput.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
  ) {}

  async findOne(filter: any): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne(filter).exec();
    if (!user) {
      console.log('User not found');
      return;
    }
    return user;
  }

  async createUser(input: CreateUserInput) {
    const { name, email, password, role, organizationId, phone } = input;

    const existingUser = await this.userModel.findOne({
      email,
      organizationId,
    });

    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await this.userModel.create([
      {
        name,
        email,
        password: hashedPassword,
        role,
        organizationId,
        phone,
        isAssignable: false,
      },
    ]);

    return user;
  }

  async adminCreateUser(
    input: CreateAdminUserInput,
    organizationId?: Types.ObjectId,
  ) {
    const { name, email, role, phone } = input;
    const inviteToken: any = crypto.randomBytes(8).toString('hex');

    const existingUser = await this.userModel.findOne({
      email,
      organizationId,
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const user = await this.userModel.create({
      name,
      email,
      role: new Types.ObjectId(role),
      organizationId,
      phone,
      password: crypto.randomBytes(8).toString('hex'),
      status: 'PENDING',
      inviteToken,
    });

    if (!user) throw new BadRequestException('User not created');

    const mailResponse: any = await this.mailService.sendInviteEmail(
      email,
      name,
      inviteToken,
    );

    if (!mailResponse) throw new BadRequestException('Mail not sent');
    await user.populate('role');
    return user;
  }

  async findByInviteToken(token: string) {
    return this.userModel.findOne({
      inviteToken: token,
      status: 'PENDING',
    });
  }

  async updateUser(
    input: UpdateUserInput,
    organizationId: string,
    userId: string,
  ) {
    const { ...rest } = input;
    const user = await this.userModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(userId),
          organizationId: new Types.ObjectId(organizationId),
        },
        { $set: rest },
        { new: true },
      )
      .populate('role');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(_id: string, organizationId: string) {
    const user = await this.userModel
      .findOne({
        _id: new Types.ObjectId(_id),
        organizationId: new Types.ObjectId(organizationId),
      })
      .populate('role');

    if (!user) throw new NotFoundException('User not found');

    if ((user.role as any)?.name === 'Owner') {
      throw new ForbiddenException('Owner cannot be deleted');
    }

    await this.userModel.deleteOne({ _id: user._id });
    return user;
  }

  async findAllUsers(organizationId: string, skip: number, take: number) {
    const users = await this.userModel
      .find({
        organizationId: new Types.ObjectId(organizationId),
      })
      .skip(skip)
      .limit(take)
      .populate('role');
    const totalCount = await this.userModel.countDocuments({
      organizationId: new Types.ObjectId(organizationId),
    });
    return { items: users, totalCount };
  }

  findMe(userId: string, organizationId: string) {
    return this.userModel.findOne({
      _id: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId),
    });
  }

  async getAll(data: any) {
    return this.userModel.find(data);
  }

  async incrementLeadCount(organizationId, id, num: number) {
    return this.userModel.findOneAndUpdate(
      { _id: id, organizationId },
      {
        $inc: { activeLeadsCount: num },
      },
    );
  }

  async bulkWrite(options: any) {
    return this.userModel.bulkWrite(options);
  }

  // user.service.ts
  async findUsersBySearch(orgId: string, search: string) {
    const query = {
      organizationId: new Types.ObjectId(orgId),
      status: 'ACTIVE',
      isAssignable: true,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };

    return this.userModel
      .find(query as any)
      .select('_id name email')
      .limit(10)
      .exec();
  }
}
