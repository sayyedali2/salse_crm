import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './schemas/inquiry.schema';
import { CreateInquiryInput } from './dto/create-inquiry.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
// import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';

@ObjectType()
export class InquiryOutput {
  @Field(() => [Inquiry])
  items: Inquiry[];

  @Field(() => Int)
  totalCount: number;
}

@Resolver(() => Inquiry)
export class InquiryResolver {
  constructor(private readonly inquiryService: InquiryService) {}

  @Mutation(() => Inquiry)
  // Public access - no guards
  createInquiry(
    @Args('createInquiryInput') createInquiryInput: CreateInquiryInput,
  ) {
    return this.inquiryService.create(createInquiryInput);
  }

  @Query(() => InquiryOutput, { name: 'getInquiries' })
  @UseGuards(AuthGuard) // Only authenticated users (Super Admin generally)
  findAll(
    @Args('skip', { type: () => Int }) skip: number,
    @Args('take', { type: () => Int }) take: number,
  ) {
    return this.inquiryService.findAll(skip, take);
  }
}
