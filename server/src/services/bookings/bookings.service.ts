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

  async createBooking(createBookingInput: CreateBookingInput, orgId: string) {
    // 1. Check if slot is already booked
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

    // 2. Lead Details fetch karein (Name aur Email ke liye)
    // Note: Iske liye LeadsService me `findOne` method hona chahiye (Step 5 me dekhein)

    const lead = await this.leadsService.findOne(
      createBookingInput.leadId,
      orgId,
    );

    if (!lead) {
      throw new BadRequestException('Lead not found');
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

    // 5. Update Lead Status to "MEETING_BOOKED" [cite: 22]
    // Hum LeadsService ka use karke status update karenge
    await this.leadsService.updateStatus(lead._id, 'MEETING_BOOKED', orgId);

    // 6. Send Confirmation Email (ICS Logic later) [cite: 20]
    // Abhi simple confirmation email bhejte hain
    // TODO: Add ICS attachment functionality in MailService
    console.log(`Sending meeting confirmation to ${lead.email}`);

    return newBooking;
  }
}
