import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createBookingDto: CreateBookingDTO): Promise<Booking> {
    return this.bookingsService.create(createBookingDto);
  }
}
