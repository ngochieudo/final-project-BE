import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingsDto } from './dto/createListings.dto';
import { Listing, User } from '@prisma/client';
import { UpdateListingDto } from './dto/updateListing.dto';

@Injectable()
export class ListingsService {
  constructor(private prismaService: PrismaService) {}

  async createListing(createListingsDto: CreateListingsDto) {
    try {
      const listing = await this.prismaService.listing.create({
        data: {
          title: createListingsDto.title,
          description: createListingsDto.description,
          imageSrc: createListingsDto.imageSrc,
          categoryId: createListingsDto.categoryId,
          roomCount: createListingsDto.roomCount,
          bathroomCount: createListingsDto.bathroomCount,
          guestCount: createListingsDto.guestCount,
          locationValue: createListingsDto.location.value,
          price: Number(createListingsDto.price),
        },
      });
      return listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  async getAllListing(query: Record<string, string>) {
    const {
      locationValue,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      category,
      minPrice,
      maxPrice,
    } = query;

    const filters: any = {};

    if (locationValue) {
      filters.locationValue = locationValue;
    }

    if (guestCount) {
      filters.guestCount = {
        gte: parseInt(guestCount, 10),
      };
    }

    if (roomCount) {
      filters.roomCount = {
        gte: parseInt(roomCount, 10),
      };
    }

    if (bathroomCount) {
      filters.bathroomCount = {
        gte: parseInt(bathroomCount, 10),
      };
    }

    if (startDate && endDate) {
      filters.AND = [
        {
          reservations: {
            none: {
              OR: [
                {
                  startDate: { lte: new Date(endDate) },
                  endDate: { gte: new Date(startDate) },
                },
              ],
            },
          },
        },
      ];
    }

    if (category) {
      filters.category = {
        label: category,
      };
    }

    if (minPrice && maxPrice) {
      filters.AND = [
        { price: { gte: query.minPrice || 0 } },
        { price: { lte: query.maxPrice || 2000 } },
      ]
    }

    const listings = await this.prismaService.listing.findMany({
      where: filters,
      orderBy: {
        createAt: 'desc',
      },
    });

    return listings;
  }

  async getListingById(id: string) {
    try {
      const listing = await this.prismaService.listing.findUnique({
        where: {
          id: id,
        },
      });

      if (!listing) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      return listing;
    } catch (error) {
      console.error(`Error fetching listing with ID ${id}:`, error);
      throw error;
    }
  }

  async updateListingById(id: string, updateListingDto: UpdateListingDto) {
    try {
      const updatedListing = await this.prismaService.listing.update({
        where: { id },
        data: {
          ...updateListingDto,
        },
      });

      return updatedListing;
    } catch (error) {
      throw new Error(
        `Failed to update listing with id ${id}: ${error.message}`,
      );
    }
  }

  async deleteListingById(id: string) {
    try {
      await this.prismaService.favorite.deleteMany({
        where: { listingId: id },
      });
      const deletedListing = await this.prismaService.listing.delete({
        where: {
          id: id,
        },
      });

      if (!deletedListing) {
        throw new NotFoundException(`Listing with ID ${id} not existed`);
      }

      return deletedListing;
    } catch (error) {
      console.error(`Error deleting listing with ID ${id}:`, error);
      throw error;
    }
  }

  async recommendListings(
    categoryId: string,
    excludeId: string,
  ): Promise<Listing[]> {
    return this.prismaService.listing.findMany({
      where: {
        categoryId,
        NOT: {
          id: excludeId,
        },
      },
      take: 10,
    });
  }
}
