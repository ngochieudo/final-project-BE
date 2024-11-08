export class UpdateListingDto {
    title?: string;
    description?: string;
    imageSrc?: string;
    categoryId?: string;
    roomCount?: number;
    bathroomCount?: number;
    guestCount?: number;
    location?: {
      value: string;
      label: string;
      flag: string;
      latlng: number[];
      region: string;
    };
    price?: number;
  }
  