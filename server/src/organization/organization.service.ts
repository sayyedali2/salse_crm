import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  Organizaiton,
  OrganizationDocument,
} from './schemas/organization.schema';
import { CreateOrganizationInput } from 'src/auth/dto/createOrganizationInput.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organizaiton.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async createOrganization(
    { name, domain, email, ownerName, logoUrl }: CreateOrganizationInput,
    session?: ClientSession,
  ) {
    const existingOrg = await this.organizationModel.findOne({ domain, email });

    if (existingOrg) throw new Error('Organization already exists!!!');

    const [org] = await this.organizationModel.create(
      [{ name, domain, email, ownerName, logoUrl }],
      session ? { session } : undefined,
    );

    return org;
  }
}
