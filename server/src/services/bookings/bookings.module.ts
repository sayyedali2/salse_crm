import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { LeadsModule } from 'src/leads/leads.module'; // ✅ Import
import { MailModule } from 'src/services/mail/mail.module'; // ✅ Import
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    LeadsModule, // ✅ LeadsService access karne ke liye
    MailModule, // ✅ Email bhejne ke liye
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  providers: [BookingsService, BookingsResolver],
})
export class BookingsModule {}
