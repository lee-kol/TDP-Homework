import {
  IsString,
  IsInt,
  Min,
  IsNotEmpty,
  IsNumber,
  IsISO8601,
  Validate,
} from 'class-validator';

export class CreateShowtimeDTO {
  @IsInt()
  @Min(1)
  movieId: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsISO8601()
  @IsNotEmpty()
  startTime: string;

  @IsISO8601()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @Min(0)
  price: number;
}
