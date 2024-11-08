import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/decorator/user.decorator';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addFavorite(
    @GetUser() user: any,
    @Body('listingId') listingId: string,
  ) {
    await this.favoriteService.addFavorite(user.id, listingId);
    return { message: 'Favorite added successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeFavorite(
    @GetUser() user: any,
    @Body('listingId') listingId: string,
  ) {
    await this.favoriteService.removeFavorite(user.id, listingId);
    return { message: 'Favorite removed successfully' };
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserFavorites(@GetUser() user: any) {
    const favorites = await this.favoriteService.getUserFavorites(user.id);
    return { favorites };
  }
}
