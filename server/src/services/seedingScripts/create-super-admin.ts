import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationType,
} from '../../organization/schemas/organization.schema';
import { Roles, RolesDocument } from '../../roles/schemas/role.schema';
import { User, UserDocument, UserStatus } from '../../users/schemas/userSchema';
import { PERMISSIONS } from '../../common/constants/permissions';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  console.log('Initializing Super Admin Seeding Script...');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const orgModel = app.get<Model<OrganizationType>>(
      getModelToken(Organization.name),
    );
    const roleModel = app.get<Model<RolesDocument>>(getModelToken(Roles.name));
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    const SUPER_ADMIN_EMAIL = 'superadmin@salse.com';
    const TEST_PASSWORD = 'password123'; // Change this as needed

    // 1. Check or Create Organization
    let org = await orgModel.findOne({ email: SUPER_ADMIN_EMAIL });
    if (!org) {
      console.log('Creating Organization...');
      org = await orgModel.create({
        name: 'Salse Super Admin Org',
        domain: 'superadmin.salse.com',
        email: SUPER_ADMIN_EMAIL,
        ownerName: 'Super Admin',
        phone: '0000000000',
      });
      console.log('Organization Created:', org._id);
    } else {
      console.log('Organization already exists:', org._id);
    }

    // 2. Check or Create Super Admin Role
    const allPermissions = Object.values(PERMISSIONS).filter(
      (p) => typeof p === 'string',
    ); // Ensure only string values
    let role = await roleModel.findOne({
      name: 'Super Admin',
      organizationID: org._id,
    });
    if (!role) {
      console.log('Creating Super Admin Role...');
      role = await roleModel.create({
        name: 'Super Admin',
        permissions: allPermissions,
        organizationID: org._id,
        isSystemRole: true,
      });
      console.log('Role Created:', role._id);
    } else {
      // Update permissions if needed to ensure they have ALL
      console.log('Role exists, updating permissions to ensure full access...');
      role.permissions = allPermissions;
      await role.save();
      console.log('Role permissions updated.');
    }

    // 3. Check or Create User
    let user = await userModel.findOne({ email: SUPER_ADMIN_EMAIL });
    if (!user) {
      console.log('Creating Super Admin User...');
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
      user = await userModel.create({
        name: 'Super Admin',
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: role._id,
        organizationId: org._id,
        phone: '0000000000',
        status: UserStatus.ACTIVE,
        isAssignable: true,
      });
      console.log('------------------------------------------------');
      console.log('Super Admin User Created Successfully!');
      console.log('Email:', SUPER_ADMIN_EMAIL);
      console.log('Password:', TEST_PASSWORD);
      console.log('------------------------------------------------');
    } else {
      console.log('Super Admin User already exists.');
      // Update role and password just in case? No, maybe just role.
      user.role = role._id;
      // user.status = UserStatus.ACTIVE; // Ensure active
      await user.save();
      console.log('Ensured user has correct role.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
