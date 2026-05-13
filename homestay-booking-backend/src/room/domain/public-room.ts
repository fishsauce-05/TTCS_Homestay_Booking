import { Room } from '../entities/room.entity';

export type PublicRoom = ReturnType<typeof toPublicRoom>;

export function toPublicRoom(room: Room) {
  const basePrice = Number(room.basePrice ?? 0);
  const images = room.images ?? [];

  return {
    id: room.id,
    name: room.name,
    thumbnail: images[0] ?? null,
    images,
    basePrice,
    nightlyRate: basePrice,
    rating: 0,
    reviewCount: 0,
    capacity: room.capacity,
    roomType: room.roomType,
    typeLabel: room.roomType,
    description: room.description,
    status: room.status,
    homestayId: room.homestayId,
    homestay: room.homestay
      ? {
          id: room.homestay.id,
          name: room.homestay.title,
          title: room.homestay.title,
          address: room.homestay.address,
        }
      : null,
    location: room.homestay?.address ?? '',
    amenities: room.amenities ?? [],
    pricingSchedules: room.pricingSchedules ?? [],
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
}
