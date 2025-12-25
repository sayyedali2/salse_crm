import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';
import { CreateBookingInput } from './dto/create-booking.input';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => Booking)
  async createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
  ) {
    return this.bookingsService.createBooking(createBookingInput);
  }
}
