import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateShowtimeDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDTO } from './dto/update-showtime.dto';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repository: Repository<Showtime>;

  const mockShowtime: Showtime = {
    id: 1,
    movieId: 12345,
    price: 20.2,
    startTime: new Date('2026-02-14T11:47:46.125405Z'),
    endTime: new Date('2026-02-14T14:47:46.125405Z'),
    theater: 'Sample Theater',
  };

  const mockRepository = {
    findOne: jest.fn().mockResolvedValue(mockShowtime),
    save: jest.fn().mockResolvedValue(mockShowtime),
    create: jest.fn().mockReturnValue(mockShowtime),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: getRepositoryToken(Showtime), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    repository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a showtime by ID', async () => {
    const result = await service.getShowtimeById(1);
    expect(result).toEqual(mockShowtime);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if showtime not found', async () => {
    repository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.getShowtimeById(2)).rejects.toThrow(NotFoundException);
  });

  it('should create a new showtime', async () => {
    const mockCreateShowtimeDto: CreateShowtimeDTO = {
      movieId: 678,
      price: 12.3,
      startTime: '2026-02-14T17:00:00.125405Z',
      endTime: '2026-02-14T18:00:00.125405Z',
      theater: 'Sample Theater 2',
    };

    const mockSavedShowtime = {
      id: 2,
      ...mockCreateShowtimeDto,
      startTime: new Date(mockCreateShowtimeDto.startTime),
      endTime: new Date(mockCreateShowtimeDto.endTime),
    };

    jest.spyOn(repository, 'create').mockReturnValue(mockSavedShowtime);
    jest.spyOn(repository, 'save').mockResolvedValue(mockSavedShowtime);

    await service.create(mockCreateShowtimeDto);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw an error if a new showtime overlaps an existing one', async () => {
    const overlappingShowtime = { ...mockShowtime, id: 1 };

    repository.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(overlappingShowtime),
    });

    const createDto: CreateShowtimeDTO = {
      movieId: 123,
      theater: 'Test Theater',
      startTime: '2026-02-14T11:00:00Z',
      endTime: '2026-02-14T13:00:00Z',
      price: 25.0,
    };

    await expect(service.create(createDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.createQueryBuilder).toHaveBeenCalled();
  });

  it('should update a showtime', async () => {
    const mockUpdateShowtimeDto: UpdateShowtimeDTO = {
      price: 30.0,
    };

    const mockExistingShowtime = {
      id: 1,
      movieId: 123,
      price: 20.0,
      startTime: new Date('2026-02-14T17:00:00.125Z'),
      endTime: new Date('2026-02-14T18:00:00.125Z'),
      theater: 'Sample Theater',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockExistingShowtime);

    jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);

    await service.update(1, mockUpdateShowtimeDto);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repository.update).toHaveBeenCalled();
  });

  it('should delete a showtime', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ affected: 1, raw: [] });
    const result = await service.remove(mockShowtime.id);
    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith({ id: mockShowtime.id });
  });

  it('should throw error if deleting a non-existing showtime', async () => {
    repository.delete = jest.fn().mockResolvedValue({ affected: 0 });
    await expect(service.remove(5)).rejects.toThrow(NotFoundException);
  });
});
