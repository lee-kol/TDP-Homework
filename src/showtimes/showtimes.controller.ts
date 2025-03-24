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
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './showtime.entity';
import { CreateShowtimeDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDTO } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':id')
  async getShowtimeById(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.getShowtimeById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createShowtimeDto: CreateShowtimeDTO): Promise<Showtime> {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Post('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDTO,
  ): Promise<void> {
    return this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.showtimesService.remove(id);
  }
}
