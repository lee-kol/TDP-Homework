import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { CreateShowtimeDTO } from './dto/create-showtime.dto';
import { UpdateShowtimeDTO } from './dto/update-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {}

  async getShowtimeById(id: number): Promise<Showtime> {
    if (!id) {
      throw new BadRequestException('Id is required to fetch a showtime');
    }

    const showtime = await this.showtimeRepository.findOne({ where: { id } });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    return showtime;
  }

  async create(createShowtimeDto: CreateShowtimeDTO): Promise<Showtime> {
    const { movieId, theater, price, startTime, endTime } = createShowtimeDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    this.validateDates(start, end);

    const overlappingShowtime = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theater = :theater', { theater })
      .andWhere('(showtime.startTime < :end AND showtime.endTime > :start)', {
        start,
        end,
      })
      .getOne();

    if (overlappingShowtime) {
      throw new BadRequestException(
        'There is already a showtime overlapping in this theater.',
      );
    }

    const showtime = this.showtimeRepository.create({
      movieId,
      theater,
      price,
      startTime: start,
      endTime: end,
    });

    return this.showtimeRepository.save(showtime);
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDTO,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id is required to update a showtime');
    }

    const showtime = await this.showtimeRepository.findOne({ where: { id } });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found.`);
    }

    const { startTime, endTime, theater, ...otherFields } = updateShowtimeDto;

    const newStart = startTime ? new Date(startTime) : showtime.startTime;
    const newEnd = endTime ? new Date(endTime) : showtime.endTime;
    const newTheater = theater || showtime.theater;

    if (startTime || endTime || theater) {
      this.validateDates(newStart, newEnd);

      const overlappingShowtime = await this.showtimeRepository
        .createQueryBuilder('showtime')
        .where('showtime.theater = :theater', { theater: newTheater })
        .andWhere('(showtime.startTime < :end AND showtime.endTime > :start)', {
          start: newStart,
          end: newEnd,
        })
        .andWhere('showtime.id != :id', { id })
        .getOne();

      if (overlappingShowtime) {
        throw new BadRequestException(
          'New schedule overlaps with another showtime in this theater.',
        );
      }
    }

    const updateData: Partial<Showtime> = {
      startTime: newStart,
      endTime: newEnd,
      theater: newTheater,
      ...otherFields,
    };

    await this.showtimeRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id is required to delete a showtime');
    }

    const result = await this.showtimeRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with title "${id}" not found`);
    }
  }

  private validateDates(startTime: Date, endTime: Date): void {
    const now = new Date();
    if (startTime < now) {
      throw new BadRequestException(
        'Start time is earlier than the current time',
      );
    }
    if (startTime > endTime) {
      throw new BadRequestException('End time is earlier than start time');
    }
  }
}
