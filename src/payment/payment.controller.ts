import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('userId') userId: string,
    @Body('listingTitle') listingTitle: string,
    @Body('imageSrc') imageSrc: string,
    @Body('listingId') listingId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('totalPrice') totalPrice: number,
    @Body('reservationId') reservationId: string,
    @Body('successUrl') successUrl: string,
    @Body('cancelUrl') cancelUrl: string,

  ) {
    return await this.paymentService.createCheckoutSession({
      userId,
      listingId,
      listingTitle,
      imageSrc,
      startDate,
      endDate,
      totalPrice,
      reservationId,
      successUrl,
      cancelUrl,
    });
  }

  @Get('checkout-session/:sessionId')
  async getCheckoutSession(@Param('sessionId') sessionId: string) {
    return await this.paymentService.getCheckoutSession(sessionId);
  }

  @Get('revenue')
  async getRevenue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    return this.paymentService.getRevenue(startDateTimestamp, endDateTimestamp);
  }
}

