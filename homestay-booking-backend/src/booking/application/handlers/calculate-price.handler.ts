import { Inject, Injectable } from '@nestjs/common';
import { BookingPolicy } from '../../domain/booking-policy';
import { BOOKING_VOUCHER } from '../ports/voucher.port';
import { PRICING } from '../ports/pricing.port';
import { ROOM_AVAILABILITY } from '../ports/room-availability.port';
import { CalculatePriceQuery } from '../queries/calculate-price.query';
import type { BookingVoucherPort as BookingVoucherPortType } from '../ports/voucher.port';
import type { PricingPort as PricingPortType } from '../ports/pricing.port';
import type { RoomAvailabilityPort as RoomAvailabilityPortType } from '../ports/room-availability.port';

@Injectable()
export class CalculatePriceHandler {
  private readonly policy = new BookingPolicy();

  constructor(
    @Inject(ROOM_AVAILABILITY)
    private readonly rooms: RoomAvailabilityPortType,
    @Inject(PRICING)
    private readonly pricing: PricingPortType,
    @Inject(BOOKING_VOUCHER)
    private readonly vouchers: BookingVoucherPortType,
  ) {}

  async execute(query: CalculatePriceQuery): Promise<{
    numberOfNights: number;
    pricePerNight: number;
    roomPrice: number;
    discountAmount: number;
    totalPrice: number;
  }> {
    const { roomId, checkInDate, checkOutDate, voucherId } = query.dto;
    await this.rooms.getRoom(roomId);
    this.policy.assertValidDateRange(checkInDate, checkOutDate);
    this.policy.assertCheckInNotPast(checkInDate);

    const price = await this.pricing.calculateTotalPrice(roomId, checkInDate, checkOutDate);
    const discountAmount = voucherId
      ? (await this.vouchers.validateById(voucherId, price.totalPrice)).discountAmount
      : 0;

    return {
      numberOfNights: price.numberOfNights,
      pricePerNight: price.pricePerNight,
      roomPrice: price.totalPrice,
      discountAmount,
      totalPrice: price.totalPrice - discountAmount,
    };
  }
}
