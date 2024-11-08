export class CreateReservationDto {
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  paymentIntentId: string;
}
