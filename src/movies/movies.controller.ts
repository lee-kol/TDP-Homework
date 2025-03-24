import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  getAllMovies(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createMovieDto: CreateMovieDTO): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Post('update/:title')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('title') title: string,
    @Body() updateMovieDto: UpdateMovieDTO,
  ): Promise<void> {
    return this.moviesService.update(title, updateMovieDto);
  }

  @Delete(':title')
  async remove(@Param('title') title: string): Promise<void> {
    return this.moviesService.remove(title);
  }
}
