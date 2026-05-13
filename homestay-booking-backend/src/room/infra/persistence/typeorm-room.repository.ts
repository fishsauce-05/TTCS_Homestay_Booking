import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, ILike, Repository } from 'typeorm';
import { Amenity } from '../../../amenity/entities/amenity.entity';
import { BookingStatus, RoomStatus } from '../../../common/enums';
import {
  PaginatedPublicRooms,
  RoomRepositoryPort,
  SaveRoomData,
} from '../../application/ports/room-repository.port';
import { toPublicRoom } from '../../domain/public-room';
import { RoomDomain } from '../../domain/room';
import { Room } from '../../entities/room.entity';
import { RoomMapper } from './room.mapper';

@Injectable()
export class TypeOrmRoomRepository implements RoomRepositoryPort {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(Amenity)
    private readonly amenityRepo: Repository<Amenity>,
  ) {}

  async create(data: SaveRoomData): Promise<RoomDomain> {
    const { amenityIds, ...payload } = data;
    const room = this.roomRepo.create({
      ...payload,
      amenities: await this.resolveAmenities(amenityIds),
    });
    return RoomMapper.toDomain(await this.roomRepo.save(room));
  }

  async save(room: RoomDomain, amenityIds?: string[]): Promise<RoomDomain> {
    const entity = this.roomRepo.create(RoomMapper.toPersistence(room));
    if (amenityIds !== undefined) {
      entity.amenities = await this.resolveAmenities(amenityIds);
    }
    return RoomMapper.toDomain(await this.roomRepo.save(entity));
  }

  async remove(room: RoomDomain): Promise<void> {
    await this.roomRepo.delete(room.id);
  }

  private async resolveAmenities(amenityIds?: string[]): Promise<Amenity[]> {
    if (!amenityIds || amenityIds.length === 0) return [];

    const amenities = await this.amenityRepo.find({
      where: { id: In(amenityIds) },
    });
    if (amenities.length !== amenityIds.length) {
      throw new BadRequestException('Mot hoac nhieu amenity khong ton tai');
    }

    return amenities;
  }

  async findPublic(
    query: Record<string, string>,
  ): Promise<PaginatedPublicRooms> {
    const page = Math.max(parseInt(query.page || '1', 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit || query.pageSize || '12', 10) || 12, 1),
      50,
    );
    const keyword = query.keyword || query.search || '';

    const qb = this.roomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.homestay', 'homestay')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect('room.pricingSchedules', 'pricingSchedules')
      .where('room.status = :status', { status: RoomStatus.ACTIVE });

    if (keyword) {
      qb.andWhere(
        '(room.name ILIKE :keyword OR room.description ILIKE :keyword OR homestay.title ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (query.location) {
      qb.andWhere(
        '(homestay.address ILIKE :location OR homestay.title ILIKE :location)',
        { location: `%${query.location}%` },
      );
    }

    if (query.category) {
      qb.andWhere('room.roomType ILIKE :category', {
        category: `%${query.category}%`,
      });
    }
    if (query.priceMin) {
      qb.andWhere('room.basePrice >= :priceMin', {
        priceMin: Number(query.priceMin),
      });
    }
    if (query.priceMax) {
      qb.andWhere('room.basePrice <= :priceMax', {
        priceMax: Number(query.priceMax),
      });
    }
    if (query.guests || query.capacityMin) {
      qb.andWhere('room.capacity >= :capacity', {
        capacity: Number(query.guests || query.capacityMin),
      });
    }

    if (query.amenities) {
      const amenities = query.amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (amenities.length) {
        qb.andWhere(
          'amenities.id IN (:...amenities) OR amenities.name IN (:...amenities)',
          { amenities },
        );
      }
    }

    const sort = query.sort || 'newest';
    if (sort === 'price_asc' || sort === 'price-asc' || sort === 'price') {
      qb.orderBy('room.basePrice', 'ASC');
    } else if (sort === 'price_desc' || sort === 'price-desc') {
      qb.orderBy('room.basePrice', 'DESC');
    } else {
      qb.orderBy('room.createdAt', 'DESC');
    }

    const [rooms, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: rooms.map((room) => toPublicRoom(RoomMapper.toDomain(room))),
      total,
      page,
      limit,
    };
  }

  async findFeatured(limit = 6) {
    const safeLimit = Math.min(Math.max(limit, 1), 12);
    const rooms = await this.roomRepo.find({
      where: { status: RoomStatus.ACTIVE },
      relations: ['homestay', 'amenities', 'pricingSchedules'],
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });

    return rooms.map((room) => toPublicRoom(RoomMapper.toDomain(room)));
  }

  async findByHomestay(homestayId: string): Promise<RoomDomain[]> {
    const rooms = await this.roomRepo.find({
      where: { homestayId },
      relations: ['amenities', 'pricingSchedules'],
      order: { createdAt: 'ASC' },
    });
    return rooms.map((room) => RoomMapper.toDomain(room));
  }

  async findById(id: string): Promise<RoomDomain | null> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['homestay', 'amenities', 'pricingSchedules'],
    });
    return room ? RoomMapper.toDomain(room) : null;
  }

  async search(homestayId: string, keyword: string): Promise<RoomDomain[]> {
    const rooms = await this.roomRepo.find({
      where: [
        { homestayId, name: ILike(`%${keyword}%`) },
        { homestayId, roomType: ILike(`%${keyword}%`) },
      ],
      relations: ['amenities'],
    });
    return rooms.map((room) => RoomMapper.toDomain(room));
  }

  async findAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    minCapacity: number,
  ): Promise<RoomDomain[]> {
    const bookedRoomIds = await this.roomRepo.manager
      .createQueryBuilder()
      .select('b.roomId')
      .from('bookings', 'b')
      .where('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      })
      .andWhere('b.checkInDate < :checkOut', { checkOut: checkOutDate })
      .andWhere('b.checkOutDate > :checkIn', { checkIn: checkInDate })
      .getRawMany<{ b_roomId?: string; roomId?: string }>();

    const excludedIds = bookedRoomIds
      .map((room) => room.roomId ?? room.b_roomId)
      .filter(Boolean);

    const qb = this.roomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.homestay', 'homestay')
      .leftJoinAndSelect('room.amenities', 'amenities')
      .leftJoinAndSelect(
        'room.pricingSchedules',
        'ps',
        'ps.startDate <= :checkOut AND ps.endDate >= :checkIn',
        { checkOut: checkOutDate, checkIn: checkInDate },
      )
      .where('room.status = :status', { status: RoomStatus.ACTIVE })
      .andWhere('room.capacity >= :minCapacity', { minCapacity });

    if (excludedIds.length > 0) {
      qb.andWhere('room.id NOT IN (:...excludedIds)', { excludedIds });
    }

    const rooms = await qb.getMany();
    return rooms.map((room) => RoomMapper.toDomain(room));
  }

  async hasActiveFutureBookings(
    roomId: string,
    fromDate: string,
  ): Promise<boolean> {
    const count = await this.roomRepo.manager
      .createQueryBuilder()
      .select('1')
      .from('bookings', 'b')
      .where('b.roomId = :roomId', { roomId })
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
      })
      .andWhere('b.checkOutDate > :fromDate', { fromDate })
      .getCount();

    return count > 0;
  }
}
