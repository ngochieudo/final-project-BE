import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  listingId: string;
}
