import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Review, User } from '@prisma/client';
import { GetUser } from 'src/user/decorator/user.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User,
  ): Promise<Review> {
    return this.reviewService.createReview(createReviewDto, user.id);
  }

  @Get('listing/:id')
  async findAllByListing(@Param('id') listingId: string): Promise<Review[]> {
    return this.reviewService.findAllByListing(listingId);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.updateReview(id, updateReviewDto, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @GetUser() user: User) {
    return this.reviewService.deleteReview(id, user.id);
  }
}
