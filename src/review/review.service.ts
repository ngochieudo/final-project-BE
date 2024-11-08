import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async canUserReviewListing(userId: string, listingId: string): Promise<boolean> {
    // Check if there's a completed reservation for this user and listing
    const completedReservation = await this.prisma.reservation.findFirst({
      where: {
        userId,
        listingId,
        status: 'Confirmed',
      },
    });
    return !!completedReservation;
  }
  
  async createReview(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const listing = await this.prisma.listing.findUnique({
      where: { id: createReviewDto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const canReview = await this.canUserReviewListing(userId, createReviewDto.listingId);
    if (!canReview) {
      throw new ForbiddenException('Only users who completed a stay can review this listing');
    }

    return this.prisma.review.create({
      data: {
        content: createReviewDto.content,
        rating: createReviewDto.rating,
        userId,
        listingId: createReviewDto.listingId,
      },
      include: {
        user: true,
        listing: true,
      },
    });
  }

  async findAllByListing(listingId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { listingId },
      include: {
        user: true,
      },
    });
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You do not have permission to edit this review');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        content: updateReviewDto.content,
        rating: updateReviewDto.rating,
      },
      include: {
        user: true,
        listing: true,
      },
    });
  }

  async deleteReview(id: string, userId: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
  
    if (!review) {
      throw new NotFoundException('Review not found');
    }
  
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true }, // assuming 'role' is a field that indicates admin status
    });
  
    if (!user) {
      throw new ForbiddenException('User not found');
    }
  
    const isAdmin = user.isAdmin === true;
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this review');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
  
}
