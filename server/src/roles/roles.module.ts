import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from './schemas/role.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

const RolesMongooseModule = MongooseModule.forFeature([
  { name: Roles.name, schema: RolesSchema },
]);

@Module({
  imports: [RolesMongooseModule, forwardRef(() => AuthModule),forwardRef(()=>UsersModule)],
  providers: [RolesService, RolesResolver],
  exports: [RolesService, RolesMongooseModule],
})
export class RolesModule {}
