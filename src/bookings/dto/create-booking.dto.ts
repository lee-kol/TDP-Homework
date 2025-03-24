import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateBookingDTO {
  @IsInt()
  @Min(1)
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
