import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly mailService: MailService,
  ) {}

  async findOne(filter: any): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne(filter).exec();
    if (!user) {
      console.log('User not found');
      return;
    }
    return user;
  }

  async createUser(input: CreateUserInput, session?: ClientSession) {
    const { name, email, password, role, organizationId, phone } = input;

    const existingUser = await this.userModel.findOne({
      email,
      organizationId,
    });

    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await this.userModel.create(
      [{ name, email, password: hashedPassword, role, organizationId, phone }],
      session ? { session } : undefined,
    );

    return user;
  }

  async adminCreateUser(
    input: CreateAdminUserInput,
    organizationId?: Types.ObjectId,
    session?: ClientSession,
  ) {
    const { name, email, role, phone } = input;
    const inviteToken: any = crypto.randomBytes(8).toString('hex');

    const existingUser = await this.userModel.findOne({
      email,
      organizationId,
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const [user] = await this.userModel.create(
      [
        {
          name,
          email,
          role,
          organizationId,
          phone,
          password: crypto.randomBytes(8).toString('hex'),
          status: 'PENDING',
          inviteToken,
        },
      ],
      session ? { session } : undefined,
    );

    if (!user) throw new BadRequestException('User not created');

    const mailResponse: any = await this.mailService.sendInviteEmail(
      email,
      name,
      inviteToken,
    );

    if (!mailResponse) throw new BadRequestException('Mail not sent');
    return user;
  }

  async findByInviteToken(token: string) {
    return this.userModel.findOne({
      inviteToken: token,
      status: 'PENDING',
    });
  }

  async updateUser(input: UpdateUserInput, organizationId: string) {
    const { _id, ...rest } = input;
    const user = await this.userModel.findOneAndUpdate(
      { _id, organizationId },
      { $set: rest },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(_id: string, organizationId: string) {
    const user = await this.userModel.findOneAndDelete({ _id: new Types.ObjectId(_id), organizationId: new Types.ObjectId(organizationId) });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAllUsers(organizationId: string) {
    return this.userModel.find({ organizationId: new Types.ObjectId(organizationId) });
  }
}
