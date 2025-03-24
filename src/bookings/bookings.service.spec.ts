import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDTO } from './dto/create-booking.dto';
import { BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<Booking>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  describe('create', () => {
    it('should create a new booking if seat is available', async () => {
      const createBookingDto: CreateBookingDTO = {
        showtimeId: 1,
        seatNumber: 5,
        userId: 'user123',
      };

      const savedBooking: Booking = {
        bookingId: 'uuid-123',
        ...createBookingDto,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(savedBooking);
      jest.spyOn(repository, 'save').mockResolvedValue(savedBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(savedBooking);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: createBookingDto.showtimeId,
          seatNumber: createBookingDto.seatNumber,
        },
      });
      expect(repository.create).toHaveBeenCalledWith(createBookingDto);
      expect(repository.save).toHaveBeenCalledWith(savedBooking);
    });

    it('should throw a BadRequestException if seat is already booked', async () => {
      const createBookingDto: CreateBookingDTO = {
        showtimeId: 1,
        seatNumber: 5,
        userId: 'user123',
      };

      const existingBooking: Booking = {
        bookingId: 'uuid-456',
        ...createBookingDto,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        new BadRequestException(
          `Seat ${createBookingDto.seatNumber} is already booked for this showtime.`,
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: createBookingDto.showtimeId,
          seatNumber: createBookingDto.seatNumber,
        },
      });
    });
  });
});
