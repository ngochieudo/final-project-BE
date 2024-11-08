
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  prisma: any;
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get(':id')
  async getCategoryWithListings(@Param('id') id: string) {
    return this.categoryService.getCategoryWithListings(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async deleteCategoryById(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id)
  }


}
