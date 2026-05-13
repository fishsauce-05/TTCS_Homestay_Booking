import { RedeemableBooking } from '../../../domain/redeemable-booking';
import { Redemption } from '../../../domain/redemption';
import { Booking } from '../../../../booking/entities/booking.entity';
import { VoucherRedemption } from '../entities/voucher-redemption.entity';

export class RedemptionMapper {
  static bookingToDomain(entity: Booking): RedeemableBooking {
    return new RedeemableBooking(entity.id, entity.userId, entity.voucherId);
  }

  static toDomain(entity: VoucherRedemption): Redemption {
    return new Redemption(
      entity.id,
      entity.bookingId,
      entity.voucherId,
      entity.userId,
      entity.voucherCode,
      entity.redeemedAt,
    );
  }
}
