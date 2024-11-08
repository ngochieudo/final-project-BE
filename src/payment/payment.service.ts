// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(data: {
    userId?: string;
    listingId?: string;
    listingTitle?: string;
    imageSrc?: string;
    startDate?: string;
    endDate?: string;
    totalPrice?: number;
    successUrl: string;
    cancelUrl: string;
    reservationId?: string;
  }) {
    const isExtension = !!data.reservationId;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isExtension
                ? `Extending Reservation for ${data.listingTitle}`
                : `Reservation for ${data.listingTitle}`, // Show the listing title
              images: [data.imageSrc], // Add the listing image URL
            },
            unit_amount: data.totalPrice * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl,
      metadata: {
        userId: data.userId,
        listingId: data.listingId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
        reservationId: data.reservationId || '',
      },
    });

    return { sessionId: session.id };
  }

  async getCheckoutSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }

  async getRevenue(startDate: number, endDate: number) {
    // Fetch successful charges from Stripe
    const charges = await this.stripe.charges.list({
      created: {
        gte: startDate,
        lte: endDate,
      },
      limit: 100,
    } as Stripe.ChargeListParams);

    // Calculate total revenue excluding refunded amounts
    const totalRevenue = charges.data.reduce((total, charge) => {
      const refundedAmount = charge.refunded ? charge.amount_refunded : 0;
      const netAmount = charge.amount - refundedAmount;
      return total + netAmount;
    }, 0);

    return {
      totalRevenue: totalRevenue / 100,
      charges: charges.data,
    };
  }
}
