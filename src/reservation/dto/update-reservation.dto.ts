import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
