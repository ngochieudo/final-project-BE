import { IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  readonly content?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating?: number;
}
