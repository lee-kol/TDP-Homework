import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './movie.entity';
import {
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovie: Movie = {
    id: 1,
    title: 'Sample Movie Title 1',
    genre: 'Action',
    duration: 120,
    rating: 8.7,
    releaseYear: 2025,
  };

  const mockMoviesService = {
    findAll: jest.fn().mockResolvedValue([mockMovie]),
    create: jest.fn().mockImplementation((dto: CreateMovieDTO) => {
      return Promise.resolve({ id: 2, ...dto });
    }),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all movies', async () => {
    const result = await controller.getAllMovies();
    expect(result).toEqual([mockMovie]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a new movie', async () => {
    const createDto: CreateMovieDTO = {
      title: 'Sample Movie Title 2',
      genre: 'Action',
      duration: 150,
      rating: 9.7,
      releaseYear: 2024,
    };

    const result = await controller.create(createDto);
    expect(result).toEqual({ id: 2, ...createDto });
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should throw validation error for invalid create input', async () => {
    const createDto: Partial<CreateMovieDTO> = {
      title: '',
      genre: 'Action',
      duration: 150,
      rating: 12,
      releaseYear: new Date().getFullYear() + 1,
    };

    try {
      await controller.create(createDto as CreateMovieDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response.message).toContain('title should not be empty');
      expect(error.response.message).toContain(
        'rating must be less than or equal to 10',
      );
      expect(error.response.message).toContain(
        'rating must be less than or equal to 10',
      );
    }
  });

  it('should update an existing movie', async () => {
    const updateDto: UpdateMovieDTO = { genre: 'Comedy' };

    await controller.update(mockMovie.title, updateDto);
    expect(service.update).toHaveBeenCalledWith(mockMovie.title, updateDto);
  });

  it('should throw error for invalid update input', async () => {
    const invalidUpdateDto = { duration: -10 };
    const validationPipe = new ValidationPipe({ transform: true });

    await expect(
      validationPipe.transform(invalidUpdateDto, {
        type: 'body',
        metatype: UpdateMovieDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if movie does not exist', async () => {
    const updateDto: UpdateMovieDTO = { genre: 'Comedy' };
    jest
      .spyOn(service, 'update')
      .mockRejectedValue(new NotFoundException('Movie not found'));

    await expect(
      controller.update('NonExistentTitle', updateDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a movie', async () => {
    await controller.remove(mockMovie.title);
    expect(service.remove).toHaveBeenCalledWith(mockMovie.title);
  });

  it('should throw NotFoundException if movie is not found', async () => {
    jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

    await expect(controller.remove('NonExistingTitle')).rejects.toThrow(
      NotFoundException,
    );
  });
});
