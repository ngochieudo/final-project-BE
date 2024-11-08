import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import Stripe from 'stripe';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  private stripe: Stripe;
  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });
  }
  //Create reservation
  async createReservation(data: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        listingId: data.listingId,
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        paymentIntentId: data.paymentIntentId,
      },
    });
  }
  //Get reservations from user
  async getAllReservations() {
    return await this.prisma.reservation.findMany({
      include: {
        user: true, // Include user details if needed
        listing: true, // Include listing details
      },
    });
  }
  //Get reservations from user
  async getReservations(userId?: string, listingId?: string) {
    return this.prisma.reservation.findMany({
      where: {
        ...(userId && { userId }),
        ...(listingId && { listingId }),
      },
      include: {
        listing: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  //Get reservation by reservation id
  async getReservationById(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            title: true,
            imageSrc: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
  //Delete reservation
  async deleteReservation(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error('Reservation not found or user not authorized');
    }

    return this.prisma.reservation.delete({
      where: { id: reservationId },
    });
  }
  //Cancel reservation
  async cancelReservation(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
  
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
  
    // Check if a refund has already been issued
    if (reservation.refundIssued) {
      throw new BadRequestException(
        'Refund has already been issued for this reservation',
      );
    }
  
    // Fetch the payment intent from Stripe
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      reservation.paymentIntentId
    );
  
    if (!paymentIntent) {
      throw new BadRequestException('Payment intent not found');
    }
  
    // Use the actual charged amount from Stripe for the refund
    const chargedAmount = paymentIntent.amount_received;
  
    if (reservation.totalPrice * 100 > chargedAmount) {
      throw new BadRequestException(
        'Reservation cannot be refunded because customer have already extend the checkout'
      );
    }
  
    // Process refund through Stripe
    const refund = await this.stripe.refunds.create({
      payment_intent: reservation.paymentIntentId,
      amount: chargedAmount, // Refund the actual charged amount
    });
  
    // Update the reservation status and refund details
    await this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'Cancelled',
        refundIssued: true,
        refundAmount: chargedAmount / 100, // Convert back to the original amount
      },
    });
  }
  

  async updateReservation(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
     });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const { startDate, endDate, totalPrice, status } = updateReservationDto;
    
    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(totalPrice && { totalPrice }),
      ...(status && { status }),
      },
    });
  }
}
