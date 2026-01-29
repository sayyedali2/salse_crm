import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryService } from './inquiry.service';
import { InquiryResolver } from './inquiry.resolver';
import { Inquiry, InquirySchema } from './schemas/inquiry.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inquiry.name, schema: InquirySchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [InquiryResolver, InquiryService],
})
export class InquiryModule {}
