import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';
import { CreateInquiryInput } from './dto/create-inquiry.input';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
  ) {}

  async create(createInquiryInput: CreateInquiryInput): Promise<Inquiry> {
    const createdInquiry = new this.inquiryModel(createInquiryInput);
    return createdInquiry.save();
  }

  async findAll(
    skip: number,
    take: number,
  ): Promise<{ items: Inquiry[]; totalCount: number }> {
    const items = await this.inquiryModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(take)
      .exec();

    const totalCount = await this.inquiryModel.countDocuments().exec();

    return { items, totalCount };
  }
}
