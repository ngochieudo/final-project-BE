import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: string, listingId: string) {
    await this.prisma.favorite.create({
      data: { userId, listingId },
    });
  }

  async removeFavorite(userId: string, listingId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId, listingId },
    });
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { listing: true },
    });
    return favorites.map(favorite => favorite.listing);
  }
}
