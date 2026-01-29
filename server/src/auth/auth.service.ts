import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { Model, Types, Connection } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateOrganizationInput } from './dto/createOrganizationInput.dto';
import { TokensService } from 'src/services/Tokens.service';
import { OrganizationService } from 'src/organization/organization.service';
import { RolesService } from 'src/roles/roles.service';
import { SetupAccountInput } from './dto/setup-account.dto';
import { LoginInput } from './dto/loginInput.dto';
import { ForgatPasswordInput } from './dto/forgatPasswordInput';
import * as crypto from 'crypto';
import { MailService } from 'src/services/mail/mail.service';
import { ResetPasswordInput } from './dto/resetPasswordInput';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private orgService: OrganizationService,
    @Inject(forwardRef(() => TokensService))
    private tokensService: TokensService,
    @Inject(forwardRef(() => RolesService)) private rolesService: RolesService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
  ) {}

  async createOrganization(input: CreateOrganizationInput) {
    try {
      const { name, email, ownerPassword, phone, ownerName } = input;

      const organization = await this.orgService.createOrganization(input);
      if (!organization)
        throw new BadRequestException(
          'Something went wrong while creating organization',
        );

      const defaultRoles = await this.rolesService.createDefaultRoles(
        organization._id.toString(),
      );

      if (!defaultRoles)
        throw new BadRequestException(
          'Something went wrong while creating default roles',
        );

      const orgId = organization._id;
      const role = await this.rolesService.getRoleByName(
        'Owner',
        new Types.ObjectId(orgId),
      );

      if (!role) {
        throw new BadRequestException(
          'Something went wrong while creating role',
        );
      }

      const user = await this.usersService.createUser({
        name: ownerName,
        email,
        phone,
        password: ownerPassword,
        role: new Types.ObjectId(role._id),
        organizationId: new Types.ObjectId(orgId),
      });

      await user.populate('role');

      if (!user)
        throw new BadRequestException(
          'Something went wrong while creating user',
        );

      const refreshToken = await this.tokensService.generateRefreshToken(
        new Types.ObjectId(user._id),
        new Types.ObjectId(orgId),
      );
      const accessToken = await this.tokensService.generateAccessToken(
        new Types.ObjectId(user._id),
        new Types.ObjectId(orgId),
      );

      await this.tokensService.SaveRefreshToken(
        new Types.ObjectId(user._id),
        refreshToken,
        new Types.ObjectId(orgId),
      );

      return { refreshToken, accessToken, user, organization };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async setupAccount(input: SetupAccountInput) {
    const user = await this.usersService.findByInviteToken(input.token);
    if (!user) throw new BadRequestException('Invalid token');

    user.password = (await bcrypt.hash(input.password, 10)).toString();
    user.status = 'ACTIVE';
    user.inviteToken = null;
    await user.save();
    await user.populate('role'); // Populate role for complete user data

    const refreshToken = await this.tokensService.generateRefreshToken(
      new Types.ObjectId(user._id),
      new Types.ObjectId(user.organizationId),
    );
    const accessToken = await this.tokensService.generateAccessToken(
      new Types.ObjectId(user._id),
      new Types.ObjectId(user.organizationId),
    );

    await this.tokensService.SaveRefreshToken(
      new Types.ObjectId(user._id),
      refreshToken,
      new Types.ObjectId(user.organizationId),
    );

    return { refreshToken, accessToken, user };
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findOne({ email: input.email });
    if (!user) throw new BadRequestException('Invalid email');
    await user.populate('role');

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid password');

    const refreshToken = await this.tokensService.generateRefreshToken(
      new Types.ObjectId(user._id),
      new Types.ObjectId(user.organizationId),
    );
    const accessToken = await this.tokensService.generateAccessToken(
      new Types.ObjectId(user._id),
      new Types.ObjectId(user.organizationId),
    );

    await this.tokensService.SaveRefreshToken(
      new Types.ObjectId(user._id),
      refreshToken,
      new Types.ObjectId(user.organizationId),
    );

    return { refreshToken, accessToken, user };
  }

  async logout(userId: Types.ObjectId, orgId: Types.ObjectId) {
    await this.tokensService.DeleteRefreshToken(userId, orgId);
    return true;
  }

  async UpdateExpireAccessToken(
    userId: Types.ObjectId,
    orgId: Types.ObjectId,
    oldRefreshToken: string,
  ) {
    try {
      const payload = this.tokensService.verifyRefreshToken(oldRefreshToken);
      if (!payload._id || !payload.organizationId)
        throw new BadRequestException('Invalid token');

      const user = await this.usersService.findOne({
        _id: payload._id,
        organizationId: payload.organizationId,
      });
      if (!user) throw new ForbiddenException('Access Denied');

      if (user.refreshToken !== oldRefreshToken) {
        this.tokensService.DeleteRefreshToken(userId, orgId);
        throw new ForbiddenException('Token Reused Detected');
      }
      const newAccessToken = this.tokensService.generateAccessToken(
        userId,
        orgId,
      );
      const newRefreshToken = this.tokensService.generateRefreshToken(
        userId,
        orgId,
      );
      await this.tokensService.SaveRefreshToken(userId, newRefreshToken, orgId);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      };
    } catch (e) {
      throw new ForbiddenException('Invalid Refresh Token');
    }
  }

  async forgotPassword(input: ForgatPasswordInput) {
    const user = await this.usersService.findOne({ email: input.email });
    if (!user) return 'Reset link sent to your email';

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.TempToken = resetToken;
    user.ExpiryTempToken = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken,
    );
    return 'Reset link sent to your email';
  }

  async resetPassword(input: ResetPasswordInput) {
    const user = await this.usersService.findOne({
      TempToken: input.token,
      ExpiryTempToken: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Invalid token or token expired');

    user.password = (await bcrypt.hash(input.password, 10)).toString();
    user.TempToken = null;
    user.ExpiryTempToken = null;
    await user.save();

    return 'Password reset successfully';
  }
}
