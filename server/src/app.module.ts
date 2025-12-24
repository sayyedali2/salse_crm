import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    LeadsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/sales_db'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    MailModule,
  ],
})
export class AppModule {}
