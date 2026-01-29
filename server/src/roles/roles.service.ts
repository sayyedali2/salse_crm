import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, RolesDocument } from './schemas/role.schema';
import { CreateRoleInput } from './dto/createRoleIntput.dto';
import { Model, Types } from 'mongoose';
import { UpdateRoleInput } from './dto/updateRoleinput.dto';
import { PERMISSIONS as p } from 'src/common/constants/permissions';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectModel(Roles.name) private readonly rolesModel: Model<RolesDocument>,
  ) {}

  async onModuleInit() {
    try {
      await this.rolesModel.collection.dropIndexes();
    } catch (error) {
      console.log('⚠️ Failed to drop indexes:', error.message);
    }
  }

  async createRole(input: CreateRoleInput, organizationId: Types.ObjectId) {
    const obj = { ...input, organizationID: organizationId };
    const role = await this.rolesModel.create(obj);
    return role;
  }

  async deleteRole(_id, orgID) {
    const role = await this.rolesModel.findOneAndDelete({
      _id: new Types.ObjectId(_id),
      organizationID: new Types.ObjectId(orgID),
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
        organizationID: new Types.ObjectId(orgID),
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

  async getRoles(orgID: string): Promise<Roles[]> {
    const roles = await this.rolesModel.find({
      organizationID: new Types.ObjectId(orgID),
    });
    return roles;
  }

  async getRoleByName(name: string, orgID: Types.ObjectId) {
    return this.rolesModel.findOne({
      name,
      organizationID: orgID,
    });
  }

  async getRoleById(roleId: string, orgID: string) {
    return this.rolesModel.findOne({
      _id: new Types.ObjectId(roleId),
      organizationID: new Types.ObjectId(orgID),
    });
  }

  async createDefaultRoles(organizationID: string) {
    const admin = [
      p.LEADS_VIEW_ALL,
      p.LEADS_CREATE,
      p.LEADS_EDIT,
      p.LEADS_DELETE,
      p.LEADS_ASSIGN,
      p.LEADS_IMPORT,
      p.LEADS_EXPORT,
      p.USERS_VIEW,
      p.USERS_CREATE,
      p.USERS_EDIT,
      p.USERS_DELETE,
      p.ROLES_VIEW,
      p.ROLES_MANAGE,
      p.SCHEDULE_VIEW,
      p.SCHEDULE_MANAGE,
      p.PROPOSALS_CREATE,
      p.PROPOSALS_VIEW,
      p.WORKFLOW_MANAGE,
      p.SYSTEM_SETTINGS,
    ];

    const sales = [
      p.LEADS_VIEW_OWN,
      p.LEADS_CREATE,
      p.LEADS_EDIT,
      p.LEADS_DELETE,
      p.LEADS_EXPORT,
      p.SCHEDULE_VIEW,
      p.PROPOSALS_CREATE,
      p.PROPOSALS_VIEW,
    ];

    const owner = [
      p.LEADS_VIEW_ALL,
      p.LEADS_CREATE,
      p.LEADS_EDIT,
      p.LEADS_DELETE,
      p.LEADS_ASSIGN,
      p.LEADS_IMPORT,
      p.LEADS_EXPORT,
      p.USERS_VIEW,
      p.ORG_UPDATE,
      p.ORG_BILLING,
      p.USERS_CREATE,
      p.USERS_EDIT,
      p.USERS_DELETE,
      p.ROLES_VIEW,
      p.ROLES_MANAGE,
      p.SCHEDULE_VIEW,
      p.SCHEDULE_MANAGE,
      p.PROPOSALS_CREATE,
      p.PROPOSALS_VIEW,
      p.WORKFLOW_MANAGE,
      p.SYSTEM_SETTINGS,
    ];

    try {
      const adminRole = await this.rolesModel.create({
        name: 'Admin',
        permissions: admin,
        isSystemRole: true,
        organizationID: new Types.ObjectId(organizationID),
      });

      const salesRole = await this.rolesModel.create({
        name: 'Sales',
        permissions: sales,
        isSystemRole: true,
        organizationID: new Types.ObjectId(organizationID),
      });

      const ownerRole = await this.rolesModel.create({
        name: 'Owner',
        permissions: owner,
        isSystemRole: true,
        organizationID: new Types.ObjectId(organizationID),
      });

      return { adminRole, salesRole, ownerRole };
    } catch (error) {
      console.error('[RolesService] Error creating default roles:', error);
      throw error;
    }
  }
}
