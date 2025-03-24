import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDTO): Promise<Booking> {
    const { showtimeId, seatNumber } = createBookingDto;

    const existingBooking = await this.bookingRepository.findOne({
      where: { showtimeId, seatNumber },
    });

    if (existingBooking) {
      throw new BadRequestException(
        `Seat ${seatNumber} is already booked for this showtime.`,
      );
    }

    return this.bookingRepository.save(
      this.bookingRepository.create(createBookingDto),
    );
  }
}
