import { Body, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingsDto } from './dto/createListings.dto';
import { User } from '@prisma/client';

@Injectable()
export class ListingsService {
    constructor(
        private prismaService: PrismaService,
    ) {}
    async createListing(createListingsDto: CreateListingsDto) {

        try{
            const listing = await this.prismaService.listing.create({
                data: {
                    title: createListingsDto.title,
                    description: createListingsDto.description,
                    imageSrc: createListingsDto.imageSrc,
                    category: createListingsDto.category,
                    roomCount: createListingsDto.roomCount,
                    bathroomCount: createListingsDto.bathroomCount,
                    guestCount: createListingsDto.guestCount,
                    location: createListingsDto.location,
                    price: Number(createListingsDto.price),
                }
            })
            return listing
        }
        catch(error) {
            console.error('Error creating listing:', error);
            throw error
        }
    }

    async getAllListing() {
        const listings = await this.prismaService.listing.findMany({
            orderBy: {
                createAt: 'desc'
            }
        });
        return listings
    }
    catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
    async getListingById(id: string) {
        try {
            const listing = await this.prismaService.listing.findUnique({
                where: {
                    id: id
                }
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
    async updateListingById(id: string) {
        
    }

    async deleteListingById(id: string) {
        try {
            const deletedListing = await this.prismaService.listing.delete({
                where: {
                    id: id
                }
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
}
