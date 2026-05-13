import { RoomDomain } from '../../domain/room';
import { Room } from '../../entities/room.entity';

export class RoomMapper {
  static toDomain(entity: Room): RoomDomain {
    return new RoomDomain(
      entity.id,
      entity.homestayId,
      entity.name,
      entity.roomType,
      entity.capacity,
      entity.description,
      entity.images,
      Number(entity.basePrice),
      entity.status,
      entity.homestay
        ? {
            id: entity.homestay.id,
            title: entity.homestay.title,
            address: entity.homestay.address,
          }
        : null,
      entity.amenities ?? [],
      entity.pricingSchedules ?? [],
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: RoomDomain): Partial<Room> {
    return {
      id: domain.id || undefined,
      homestayId: domain.homestayId,
      name: domain.name,
      roomType: domain.roomType,
      capacity: domain.capacity,
      description: domain.description,
      images: domain.images,
      basePrice: domain.basePrice,
      status: domain.status,
    };
  }
}
