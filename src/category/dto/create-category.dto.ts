import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  label: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;
}
