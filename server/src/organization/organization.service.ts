import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Organization, OrganizationType } from './schemas/organization.schema';
import { CreateOrganizationInput } from 'src/auth/dto/createOrganizationInput.dto';
import { UpdateOrganizationInput } from './dto/updateOrganizationInput';
import { MailService } from 'src/services/mail/mail.service';
import * as crypto from 'crypto';
import { encryptKey } from 'src/utils/encryption.utils';

@Injectable()
export class OrganizationService implements OnModuleInit {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationType>,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async onModuleInit() {
    try {
      // Remove unique index on ownerName if it exists
      await this.organizationModel.collection.dropIndex('ownerName_1');
      console.log('✅ ORGANIZATION OWNERNAME INDEX DROPPED');
    } catch (error) {
      // Index might not exist, which is fine
      if (error.code !== 27) {
        // 27 = Index not found
        console.log('ℹ️ Organization index check:', error.message);
      }
    }
  }

  async createOrganization({
    name,
    domain,
    email,
    ownerName,
    phone,
    logoUrl,
  }: CreateOrganizationInput) {
    const existingOrg = await this.organizationModel.findOne({ domain, email });

    if (existingOrg) throw new Error('Organization already exists!!!');

    try {
      const org = await this.organizationModel.create({
        name,
        domain,
        email,
        ownerName,
        phone,
        logoUrl: logoUrl || '',
      });

      return org;
    } catch (error) {
      console.error('Organization service: Error creating org:', error);
      throw error;
    }
  }

  async findOne(data: any) {
    return this.organizationModel.findOne(data);
  }

  async updateOrganization(orgId: string, data: UpdateOrganizationInput) {
    const result = await this.organizationModel.findByIdAndUpdate(
      orgId,
      {
        $set: {
          ...data,
        },
      },
      { new: true },
    );
    return result;
  }

  async deleteOrganization(orgId: string) {
    const result = await this.organizationModel.findByIdAndDelete(orgId);
    return result;
  }

  async findAll(skip: number, take: number) {
    const items = await this.organizationModel
      .find()
      .skip(skip)
      .limit(take)
      .lean();
    const totalCount = await this.organizationModel.countDocuments();
    return { totalCount, items };
  }

  async enableEmailService(
    data: { email: string; name: string; apiKey: string },
    orgId: string,
  ) {
    const org = await this.organizationModel.findById(new Types.ObjectId(orgId));
    if (!org) throw new NotFoundException('Organization not found!!!');
    const EcryptedKey = encryptKey(data.apiKey);

    org.senderEmail = data.email;
    org.apiKey = EcryptedKey.encryptedData;
    org.iv = EcryptedKey.iv;
    org.senderName = data.name;
    org.emailServiceStatus = true;
    await org.save();
    return org;
  }

  async emailServiceStatus(orgId: string) {
    const org = await this.organizationModel.findById(new Types.ObjectId(orgId));
    if (!org) throw new NotFoundException('Organization not found!!!');
    return org.emailServiceStatus;
  }
}
