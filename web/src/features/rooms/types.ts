export type RoomType = 'king' | 'queen' | 'double' | 'suite';

export interface Room {
  id: number;
  roomNumber: string;
  type: RoomType;
  name: string;
  description: string;
  maxGuests: number;
  beds: string;
  isSmoking: boolean;
  hasJacuzzi: boolean;
  basePricePerNight: number;
  isActive: boolean;
  imageKey: string | null;
  amenities: string[];
  floor: number;
  /** Gradient shown until a real photo is provided */
  imagePlaceholderGradient: string;
}

/** One row of the pricing_rules table */
export interface PricingRule {
  id: number;
  label: string;
  appliesTo: 'all' | 'king' | 'queen' | 'double' | 'suite' | 'room';
  roomId: number | null;
  pricePerNight: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
