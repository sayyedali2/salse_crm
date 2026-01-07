import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Roles, RolesDocument } from 'src/auth/schemas/role.schema';
import { PERMISSIONS as p } from 'src/common/constants/permissions';

export const admin = [
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

export const sales = [
  p.LEADS_VIEW_OWN,
  p.LEADS_CREATE,
  p.LEADS_EDIT,
  p.LEADS_EXPORT,
  p.SCHEDULE_VIEW,
  p.PROPOSALS_CREATE,
  p.PROPOSALS_VIEW,
];

export const owner=[
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
]

@Injectable()
export class DefaultRoleService {
  constructor(
    @InjectModel(Roles.name) private rolesModel: Model<RolesDocument>,
  ) {}

  async createDefaultRoles(organizationID: Types.ObjectId, session?: ClientSession) {
    const adminRole=await this.rolesModel.create([{
      name: 'Admin',
      permission: admin,
      organizationID,
    }], session ? { session } : undefined);
    const salesRole=await this.rolesModel.create([{
      name: 'Sales',
      permission: sales,
      organizationID,
    }], session ? { session } : undefined);
    const ownerRole=await this.rolesModel.create([{
      name: 'Owner',
      permission: owner,
      organizationID,
    }], session ? { session } : undefined);
    return {adminRole,salesRole,ownerRole};
  }
}
