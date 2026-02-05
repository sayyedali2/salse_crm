import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingInput } from './dto/create-booking.input';
import { LeadsService } from 'src/leads/leads.service';


@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private leadsService: LeadsService, // Lead service inject karein
  ) {}

  async createBooking(createBookingInput: CreateBookingInput) {
    // 1. First, fetch the lead by ID to get organization details
    const lead = await this.leadsService.findLeadById(createBookingInput.leadId);

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    const orgId = lead.organizationId;

    // 2. Check if slot is already booked
    const existingBooking = await this.bookingModel.findOne({
      organizationId: new Types.ObjectId(orgId),
      date: createBookingInput.date,
      timeSlot: createBookingInput.timeSlot,
    });

    if (existingBooking) {
      throw new BadRequestException(
        'This slot is already booked! Please choose another.',
      );
    }

    // 3. Generate Meeting Link (Mock Logic)
    // Real world me ye Google Calendar API se aayega
    const meetingCode = Math.random().toString(36).substring(7);
    const meetingLink = `https://meet.google.com/${meetingCode}`;

    // 4. Save Booking
    const newBooking = new this.bookingModel({
      ...createBookingInput,
      clientName: lead.name,
      clientEmail: lead.email,
      organizationId: new Types.ObjectId(orgId),
      meetingLink,
    });

    await newBooking.save();

    // 5. Update Lead Status to "MEETING_BOOKED"
    await this.leadsService.updateStatus(lead._id.toString(), 'MEETING_BOOKED', orgId.toString());

    // 6. Send Confirmation Email
    console.log(`Sending meeting confirmation to ${lead.email}`);

    return newBooking;
  }
}
