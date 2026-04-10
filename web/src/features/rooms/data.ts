import type { Room } from './types';

/** Mock data — will be replaced by DB queries in Phase 2 */
export const ROOMS: Room[] = [
  {
    id: 1,
    name: 'Standard Room',
    type: 'standard',
    description: 'Comfortable and clean with everything you need for a great stay. Perfect for solo travelers or couples.',
    pricePerNight: 89,
    maxGuests: 2,
    beds: '1 Queen Bed',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Flat-Screen TV', 'Mini Fridge', 'Coffee Maker'],
    imageAlt: 'Standard Room at DownBeach Motel',
    imagePlaceholderGradient: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)',
  },
  {
    id: 2,
    name: 'Deluxe Room',
    type: 'deluxe',
    description: 'Extra space and upgraded finishes. A king bed and partial ocean view make this room a crowd favorite.',
    pricePerNight: 129,
    maxGuests: 3,
    beds: '1 King Bed',
    amenities: ['Free Wi-Fi', 'Ocean View', 'Air Conditioning', 'Flat-Screen TV', 'Mini Fridge', 'Coffee Maker', 'Work Desk'],
    imageAlt: 'Deluxe Room at DownBeach Motel',
    imagePlaceholderGradient: 'linear-gradient(135deg, #7dd3fc 0%, #bae6fd 100%)',
  },
  {
    id: 3,
    name: 'Family Suite',
    type: 'suite',
    description: 'Spacious two-room suite ideal for families. Separate sleeping areas and a full bathroom with tub.',
    pricePerNight: 179,
    maxGuests: 5,
    beds: '1 King + 2 Twin Beds',
    amenities: ['Free Wi-Fi', 'Two Rooms', 'Air Conditioning', 'Flat-Screen TV', 'Mini Kitchen', 'Coffee Maker', 'Bathtub', 'Pull-out Sofa'],
    imageAlt: 'Family Suite at DownBeach Motel',
    imagePlaceholderGradient: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
  },
];
