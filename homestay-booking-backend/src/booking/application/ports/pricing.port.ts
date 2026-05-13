export const PRICING = Symbol('PRICING');

export interface PricingPort {
  calculateTotalPrice(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<{
    totalPrice: number;
    pricePerNight: number;
    numberOfNights: number;
  }>;
}
