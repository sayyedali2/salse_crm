import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { PubSubModule } from './common/pubsub.module';
import { LeadsModule } from './leads/leads.module';
import { MailModule } from 'src/services/mail/mail.module';
import { BookingsModule } from 'src/services/bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { RolesModule } from './roles/roles.module';
import { InquiryModule } from './inquiry/inquiry.module';

// Guards
import { PermissionGuard } from './common/decorator/permission/permission.gaurd';

@Module({
  imports: [
    // 1. Configuration Setup
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Database Setup (Async connection)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),

    // 3. Global PubSub Setup (Ek hi instance poori app ke liye)
    PubSubModule,

    // 4. GraphQL Setup with Subscriptions
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      subscriptions: {
        // Next.js ke client (graphql-ws) ke liye ye zaroori hai
        'graphql-ws': {
          onConnect: () => {
            console.log('Client connected to WebSocket');
          },
        },
        // Purane clients ya playground ke liye (optional but good to have)
        'subscriptions-transport-ws': true,
      },
    }),

    // 5. App Modules
    ScheduleModule.forRoot(),
    LeadsModule,
    MailModule,
    BookingsModule,
    UsersModule,
    AuthModule,
    OrganizationModule,
    RolesModule,
    InquiryModule,
  ],
  providers: [PermissionGuard],
})
export class AppModule {}
