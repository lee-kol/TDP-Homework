import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDTO } from './dto/update-showtime.dto';
import { Showtime } from './showtime.entity';
import {
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockShowtime: Showtime = {
    id: 1,
    movieId: 12345,
    price: 20.2,
    startTime: new Date('2026-02-14T11:47:46.125405Z'),
    endTime: new Date('2026-02-14T14:47:46.125405Z'),
    theater: 'Sample Theater',
  };

  const mockShowtimesService = {
    getShowtimeById: jest.fn().mockResolvedValue(mockShowtime),
    create: jest.fn().mockImplementation((dto: CreateShowtimeDTO) => {
      return Promise.resolve({ id: 2, ...dto });
    }),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a showtime by ID', async () => {
    const result = await controller.getShowtimeById(1);
    expect(result).toEqual(mockShowtime);
    expect(service.getShowtimeById).toHaveBeenCalledWith(1);
  });

  it('should create a new showtime', async () => {
    const createDto: CreateShowtimeDTO = {
      movieId: 678,
      price: 12.3,
      startTime: '2026-02-14T17:00:00.125405Z',
      endTime: '2026-02-14T18:00:00.125405Z',
      theater: 'Sample Theater 2',
    };

    const result = await controller.create(createDto);
    expect(result).toEqual({ id: 2, ...createDto });
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  // it('should throw validation error for invalid create input', async () => {
  //   const createDto: Partial<CreateShowtimeDTO> = {
  //     movieId: 678,
  //     price: 12.3,
  //     startTime: '2026-02-14T12:00:00.125405Z',
  //     endTime: '2026-02-14T16:00:00.125405Z',
  //     theater: '',
  //   };
  //
  //   try {
  //     await controller.create(createDto as CreateShowtimeDTO);
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //     expect(error.response.message).toContain('theater should not be empty');
  //   }
  // });
  //
  // it('should throw validation error for invalid dates in create input', async () => {
  //   const createDto: Partial<CreateShowtimeDTO> = {
  //     movieId: 678,
  //     price: 12.3,
  //     startTime: '2026-02-14T17:00:00.125405Z',
  //     endTime: '2026-02-14T16:00:00.125405Z',
  //     theater: '',
  //   };
  //
  //   try {
  //     await controller.create(createDto as CreateShowtimeDTO);
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //     expect(error.response.message).toContain(
  //       'End time is earlier than start time',
  //     );
  //   }
  // });
  //
  // it('should throw error for overlapping times in create input', async () => {
  //   const createDto: CreateShowtimeDTO = {
  //     movieId: 222,
  //     price: 12.3,
  //     startTime: '2026-02-14T12:00:00.125405Z',
  //     endTime: '2026-02-14T15:00:00.125405Z',
  //     theater: 'Sample Theater',
  //   };
  //
  //   const result = await controller.create(createDto);
  //   expect(result).toEqual({ id: 2, ...createDto });
  //   expect(service.create).toHaveBeenCalledWith(createDto);
  // });

  it('should update an existing showtime', async () => {
    const updateDto: UpdateShowtimeDTO = {
      movieId: 678,
    };
    await controller.update(mockShowtime.id, updateDto);
    expect(service.update).toHaveBeenCalledWith(mockShowtime.id, updateDto);
  });

  it('should delete a showtime', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  // it('should throw error for overlapping times in update input', async () => {
  //   const invalidUpdateDto = { duration: -10 };
  //   const validationPipe = new ValidationPipe({ transform: true });
  //
  //   await expect(
  //     validationPipe.transform(invalidUpdateDto, {
  //       type: 'body',
  //       metatype: UpdateMovieDTO,
  //     }),
  //   ).rejects.toThrow(BadRequestException);
  // });
});
