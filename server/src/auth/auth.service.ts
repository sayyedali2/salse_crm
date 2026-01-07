import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { Model, Types, Connection } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateOrganizationInput } from './dto/createOrganizationInput.dto';
import { TokensService } from 'src/services/Tokens.service';
import { OrganizationService } from 'src/organization/organization.service';
import { Roles, RolesDocument } from './schemas/role.schema';
import { DefaultRoleService } from 'src/services/seedingScripts/defaultRole.service';
import { SetupAccountInput } from './dto/setup-account.dto';
import { LoginInput } from './dto/loginInput.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private usersService: UsersService,
    private jwtService: JwtService,
    private orgService: OrganizationService,
    private tokensService: TokensService,
    private defaultRoleService: DefaultRoleService,
    @InjectModel(Roles.name)
    private rolesModel: Model<RolesDocument>,
  ) {}

  

  async createOrganization(input: CreateOrganizationInput) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { name, email, password, phone } = input;

      const organization = await this.orgService.createOrganization(
        input,
        session,
      );
      if (!organization)
        throw new BadRequestException(
          'Something went wrong while creating organization',
        );

      const defaultRoles = await this.defaultRoleService.createDefaultRoles(
        new Types.ObjectId(organization._id),
        session,
      );

      if (!defaultRoles)
        throw new BadRequestException(
          'Something went wrong while creating default roles',
        );

      const orgId = organization._id;
      const role = await this.rolesModel.findOne({
        name: 'Owner',
        organizationId: orgId,
      }).session(session);

      if (!role)
        throw new BadRequestException(
          'Something went wrong while creating role',
        );

      const user = await this.usersService.createUser(
        {
          name,
          email,
          phone,
          password,
          role: new Types.ObjectId(role._id),
          organizationId: new Types.ObjectId(orgId),
        },
        session,
      );

      if (!user || !user._id)
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
        session,
      );

      session.commitTransaction();
      return { refreshToken, accessToken, user };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async setupAccount(input:SetupAccountInput){

    const user = await this.usersService.findByInviteToken(input.token);
    if(!user) throw new BadRequestException('Invalid token');
    
    user.password = (await bcrypt.hash(input.password,10)).toString();
    user.status = 'ACTIVE';
    user.inviteToken = null;
    await user.save();

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

    return {refreshToken, accessToken, user};
  }

  async login(input:LoginInput){
    const user = await this.usersService.findOne({email:input.email})
    if(!user) throw new BadRequestException('Invalid email')

    const isMatch = await bcrypt.compare(input.password, user.password);
    if(!isMatch) throw new BadRequestException('Invalid password')

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

    return {refreshToken, accessToken, user};
    
  }

  async logout(userId:Types.ObjectId, orgId:Types.ObjectId){
    await this.tokensService.DeleteRefreshToken(userId, orgId)
    return true;
  }

}
