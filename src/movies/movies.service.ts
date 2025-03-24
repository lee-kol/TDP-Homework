import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async create(createMovieDto: CreateMovieDTO): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });
    if (existingMovie) {
      throw new BadRequestException(
        `Movie with title "${createMovieDto.title}" already exists`,
      );
    }

    return this.movieRepository.save(
      this.movieRepository.create(createMovieDto),
    );
  }

  async update(title: string, updateMovieDto: UpdateMovieDTO): Promise<void> {
    if (!title) {
      throw new BadRequestException('Title is required to update a movie');
    }

    if (updateMovieDto.title) {
      const existingTitle = await this.movieRepository.findOne({
        where: { title: updateMovieDto.title },
      });

      if (existingTitle) {
        throw new NotFoundException(
          `Movie with title "${title}" already exists`,
        );
      }
    }

    const existingMovie = await this.movieRepository.findOne({
      where: { title },
    });

    if (!existingMovie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }

    await this.movieRepository.update({ title }, updateMovieDto);
  }

  async remove(title: string): Promise<void> {
    if (!title) {
      throw new BadRequestException('Title is required to delete a movie');
    }

    const result = await this.movieRepository.delete({ title });

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }
  }
}
