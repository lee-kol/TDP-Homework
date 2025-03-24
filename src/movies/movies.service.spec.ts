import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockMovie = {
  id: 1,
  title: 'Sample Movie Title',
  genre: 'Action',
  duration: 120,
  rating: 8.7,
  releaseYear: 2025,
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all movies', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockMovie]);
    const result = await service.findAll();
    expect(result).toEqual([mockMovie]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should create a new movie', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue(mockMovie);
    jest.spyOn(repository, 'save').mockResolvedValue(mockMovie);

    const result = await service.create(mockMovie);
    expect(result).toEqual(mockMovie);
    expect(repository.create).toHaveBeenCalledWith(mockMovie);
    expect(repository.save).toHaveBeenCalledWith(mockMovie);
  });

  it('should throw BadRequestException if movie title already exists', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie);
    await expect(service.create(mockMovie)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update an existing movie', async () => {
    const updateDto = { genre: 'Thriller' };
    const updatedMovie = { ...mockMovie, ...updateDto };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie);
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);

    const result = await service.update(mockMovie.title, updateDto);

    expect(result).toBeUndefined();
    expect(repository.update).toHaveBeenCalledWith(
      { title: mockMovie.title },
      updateDto,
    );

    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedMovie);

    const updatedMovieResult = await repository.findOne({
      where: { title: mockMovie.title },
    });
    expect(updatedMovieResult?.genre).toBe(updateDto.genre);
  });

  it("should throw NotFoundException if movie doesn't exist", async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    await expect(
      service.update('Non-existing Title', { genre: 'Action' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a movie', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ affected: 1, raw: [] });
    const result = await service.remove(mockMovie.title);
    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith({ title: mockMovie.title });
  });

  it('should throw NotFoundException if deleting a non-existent movie', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockResolvedValue({ affected: 0, raw: [] });
    await expect(service.remove('Non-existent Movie')).rejects.toThrow(
      NotFoundException,
    );
  });
});
