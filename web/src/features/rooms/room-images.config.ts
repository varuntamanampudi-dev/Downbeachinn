/**
 * Room image registry.
 *
 * HOW TO ADD PHOTOS:
 *  1. Drop image files into:  public/images/rooms/<type>/
 *     e.g. public/images/rooms/king/main.jpg
 *          public/images/rooms/king/bathroom.jpg
 *          public/images/rooms/king/view.jpg
 *
 *  2. Add the filename to the array below for that room type.
 *
 * Supported formats: .jpg  .jpeg  .webp  .png
 * Recommended size:  1200 × 800px, under 300 KB each.
 */

export type RoomImageEntry = {
  filename: string;   // just the filename, e.g. "main.jpg"
  alt: string;        // accessibility description
};

export const ROOM_IMAGES: Record<string, RoomImageEntry[]> = {
  king: [
    // { filename: 'main.jpg',      alt: 'King room overview' },
    // { filename: 'bathroom.jpg',  alt: 'King room bathroom' },
    // { filename: 'view.jpg',      alt: 'View from king room' },
  ],
  queen: [
    // { filename: 'main.jpg',      alt: 'Queen room overview' },
    // { filename: 'bathroom.jpg',  alt: 'Queen room bathroom' },
  ],
  double: [
    // { filename: 'main.jpg',      alt: 'Double room overview' },
    // { filename: 'beds.jpg',      alt: 'Double room beds' },
    // { filename: 'bathroom.jpg',  alt: 'Double room bathroom' },
  ],
  suite: [
    // { filename: 'main.jpg',      alt: 'Suite overview' },
    // { filename: 'jacuzzi.jpg',   alt: 'In-room Jacuzzi tub' },
    // { filename: 'sitting.jpg',   alt: 'Suite sitting area' },
    // { filename: 'bathroom.jpg',  alt: 'Suite bathroom' },
  ],
};

/** Returns the full public path for a room image */
export function roomImagePath(type: string, filename: string): string {
  return `/images/rooms/${type}/${filename}`;
}

/** Returns true if a room type has at least one registered image */
export function hasImages(type: string): boolean {
  return (ROOM_IMAGES[type]?.length ?? 0) > 0;
}
