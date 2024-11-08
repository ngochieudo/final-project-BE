// src/category/category.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { label, description, icon } = createCategoryDto;
    return await this.prisma.category.create({
      data: {
        label,
        description,
        icon,
      },
    });
  }

  async getAllCategories() {
    return await this.prisma.category.findMany();
  }

  async getCategoryWithListings(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { listings: true },
    });
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }
  
  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { listings: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.listings.length > 0) {
      throw new BadRequestException('Category has listings and cannot be deleted');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

}
