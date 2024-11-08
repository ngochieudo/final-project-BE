import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
