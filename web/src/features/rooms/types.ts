export type RoomType = 'standard' | 'deluxe' | 'suite';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  beds: string;
  amenities: string[];
  imageAlt: string;
  /** placeholder color until real images are provided */
  imagePlaceholderGradient: string;
}
