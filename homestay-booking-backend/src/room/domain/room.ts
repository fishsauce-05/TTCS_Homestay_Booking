import { RoomStatus } from '../../common/enums';

export interface RoomHomestayView {
  id: string;
  title: string;
  address: string;
}

export class RoomDomain {
  constructor(
    public readonly id: string,
    public readonly homestayId: string,
    public name: string,
    public roomType: string,
    public capacity: number,
    public description: string | null,
    public images: string[] | null,
    public basePrice: number,
    public status: RoomStatus,
    public readonly homestay?: RoomHomestayView | null,
    public readonly amenities: unknown[] = [],
    public readonly pricingSchedules: unknown[] = [],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
