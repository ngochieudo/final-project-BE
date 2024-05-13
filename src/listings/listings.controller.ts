import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingsDto } from './dto/createListings.dto';

@Controller('listings')
export class ListingsController {
    constructor(private listingsService: ListingsService) {

    }
    @Post()
    async createListing(@Body() createListingsDto: CreateListingsDto) {
        return await this.listingsService.createListing(createListingsDto)
    }

    @Get()
    async getAllListing() {
        return await this.listingsService.getAllListing();
    }
    @Get(':id')
    async getListingById(@Param('id') id: string) {
        return await this.listingsService.getListingById(id)
    }

}
