import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingsDto } from './dto/createListings.dto';
import { Listing } from '@prisma/client';
import { UpdateListingDto } from './dto/updateListing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}
  @Post()
  async createListing(@Body() createListingsDto: CreateListingsDto) {
    return await this.listingsService.createListing(createListingsDto);
  }

  @Get()
  async getAllListing(
    @Query() query: Record<string, string>,
  ) {
    return await this.listingsService.getAllListing(query);
  }

  @Get('recommend')
  async recommendedListings(
    @Query('categoryId') categoryId: string,
    @Query('excludeId') excludeId: string,
  ): Promise<Listing[]> {
    return this.listingsService.recommendListings(categoryId, excludeId);
  }
  @Get(':id')
  async getListingById(@Param('id') id: string) {
    return await this.listingsService.getListingById(id);
  }

  @Put(':id')
  async updateListing(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto
  ) {
    return this.listingsService.updateListingById(id, updateListingDto);
  }

  @Delete(':id')
  async deleteListingById(@Param('id') id: string) {
    return this.listingsService.deleteListingById(id)
  }
}
