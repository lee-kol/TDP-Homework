import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDTO } from './dto/create-booking.dto';
import { BadRequestException } from '@nestjs/common';
import { Booking } from './booking.entity';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return a booking when the booking is created successfully', async () => {
      const createBookingDto: CreateBookingDTO = {
        showtimeId: 1,
        seatNumber: 5,
        userId: 'user123',
      };

      const savedBooking: Booking = {
        bookingId: 'uuid-123',
        ...createBookingDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(savedBooking);

      const result = await controller.create(createBookingDto);

      expect(result).toEqual(savedBooking);
      expect(service.create).toHaveBeenCalledWith(createBookingDto);
    });

    it('should throw BadRequestException when the seat is already booked', async () => {
      const createBookingDto: CreateBookingDTO = {
        showtimeId: 1,
        seatNumber: 5,
        userId: 'user123',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new BadRequestException(
            `Seat ${createBookingDto.seatNumber} is already booked for this showtime.`,
          ),
        );

      await expect(controller.create(createBookingDto)).rejects.toThrow(
        new BadRequestException(
          `Seat ${createBookingDto.seatNumber} is already booked for this showtime.`,
        ),
      );

      expect(service.create).toHaveBeenCalledWith(createBookingDto);
    });
  });
});
