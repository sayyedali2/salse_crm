import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { LeadsModule } from '../leads/leads.module'; // ✅ Import
import { MailModule } from '../mail/mail.module'; // ✅ Import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    LeadsModule, // ✅ LeadsService access karne ke liye
    MailModule, // ✅ Email bhejne ke liye
  ],
  providers: [BookingsService, BookingsResolver],
})
export class BookingsModule {}
