import { Resolver, Mutation, Args,Context } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';
import { CreateBookingInput } from './dto/create-booking.input';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';


@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => Booking)
  @UseGuards(AuthGuard)
  async createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
    @Context() context: any,
  ) {
    return this.bookingsService.createBooking(createBookingInput, context.req.user.organizationId);
  }
}
