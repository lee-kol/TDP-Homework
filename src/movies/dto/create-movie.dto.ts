import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Max(new Date().getFullYear())
  releaseYear: number;
}
