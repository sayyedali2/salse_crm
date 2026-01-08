import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, RolesDocument } from './schemas/role.schema';
import { CreateRoleInput } from './dto/createRoleIntput.dto';
import { Model, Types } from 'mongoose';
import { UpdateRoleInput } from './dto/updateRoleinput.dto';


@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name) private readonly rolesModel: Model<RolesDocument>,
  ) {}

  async createRole(input: CreateRoleInput, organizationId: Types.ObjectId) {
    const obj = {...input, organizationId}
    const role = await this.rolesModel.create([obj]);
    return role;
  }

  async deleteRole(_id, orgID) {
    const role = await this.rolesModel.findOneAndDelete({
      _id: new Types.ObjectId(_id),
      organizationId: new Types.ObjectId(orgID),
    });
    if (!role) {
      throw new NotFoundException('Role not found or you do not have access');
    }
    return role;
  }

  async updateRole(input: UpdateRoleInput, orgID) {
    const { _id, ...updateData } = input;
    const role = await this.rolesModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(_id),
        organizationId: new Types.ObjectId(orgID),
      },
      {
        $set: updateData,
      },
      { new: true },
    );
    if (!role) {
      throw new NotFoundException('Role not found or you do not have access');
    }
    return role;
  }

    async getRoles(orgID:string):Promise<Roles[]>{
        const roles = await this.rolesModel.find({organizationId: new Types.ObjectId(orgID)});
        return roles;
    }

}
