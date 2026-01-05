import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { PubSubModule } from './common/pubsub.module';
import { LeadsModule } from './leads/leads.module';
import { MailModule } from './mail/mail.module';
import { BookingsModule } from './bookings/bookings.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
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
  ],
  // Note: Providers yahan khali hain kyunki PubSub 'PubSubModule' se aa raha hai
  providers: [],
})
export class AppModule {}
