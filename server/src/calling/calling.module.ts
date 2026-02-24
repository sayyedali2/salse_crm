import { Module } from '@nestjs/common';
import { OrganizationModule } from 'src/organization/organization.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CallingService } from './calling.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Calling, callingSchema } from './schemas/calling.schema';
import { CallingResolver } from './calling.resolver';
@Module({
    imports: [OrganizationModule,
        MongooseModule.forFeature([
            { name: Calling.name, schema: callingSchema }
        ]),
        AuthModule,
        UsersModule
    ],
    providers: [CallingService, CallingResolver],
    exports: [CallingService]
})
export class CallingModule { }

