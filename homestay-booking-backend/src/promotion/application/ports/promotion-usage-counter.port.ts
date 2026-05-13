export const PROMOTION_USAGE_COUNTER = Symbol('PROMOTION_USAGE_COUNTER');

export interface PromotionUsageCounterPort {
  increment(voucherId: string): Promise<void>;
  decrement(voucherId: string): Promise<void>;
}
