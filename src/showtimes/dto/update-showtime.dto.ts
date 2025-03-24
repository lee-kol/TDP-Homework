import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDTO } from './create-showtime.dto';

export class UpdateShowtimeDTO extends PartialType(CreateShowtimeDTO) {}
