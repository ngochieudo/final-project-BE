
export class CreateListingsDto {
    title: string
    description: string
    imageSrc: string
    category: string
    roomCount: number
    bathroomCount: number
    guestCount: number
    location: {
        value: string;
        label: string;
        flag: string;
        latlng: number[];
        region: string;
    };
    price: number
}