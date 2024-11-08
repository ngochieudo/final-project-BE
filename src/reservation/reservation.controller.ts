import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get('all')
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

  @Get()
  async getReservations(
    @Query('userId') userId?: string,
    @Query('listingId') listingId?: string,
  ) {
    return this.reservationService.getReservations(userId, listingId);
  }

  @Get(':id')
  async getReservationById(@Param('id') id: string) {
    return this.reservationService.getReservationById(id);
  }

  @Delete(':id')
  async deleteReservation(
    @Param('id') reservationId: string,
  ) {
    return this.reservationService.deleteReservation(reservationId);
  }

  @Patch(':id/cancel')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationService.cancelReservation(id);
  }

  @Patch(':id')
  async updateReservation(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationService.updateReservation(id, updateReservationDto);
  }
}
