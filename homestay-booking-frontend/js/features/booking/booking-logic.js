import { apiPost, apiGet, getToken } from '../../core/api.js';
import { state } from '../../core/state.js';
import { getVal, nightsBetween } from '../../shared/utils.js';

export async function createBooking() {
  return apiPost('/bookings', {
    roomId: state.booking.roomId,
    checkInDate: getVal('booking-checkin'),
    checkOutDate: getVal('booking-checkout'),
    numberOfGuests: Number(getVal('booking-guests-count')) || 1,
    voucherCode: state.booking.voucherCode || undefined,
  });
}

export async function validateVoucherAPI(code) {
  const v = await apiPost('/vouchers/validate', { code, totalPrice: state.booking.subtotal });
  return {
    valid: v.valid ?? true,
    voucherId: v.voucherId,
    type: v.type?.toLowerCase() ?? 'percent',
    value: v.discountValue,
    discountAmount: v.discountAmount,
    description: v.name ?? v.message ?? `Voucher ${code}`,
  };
}

export async function markTransferred(bookingId) {
  const payment = await apiPost('/payments', { bookingId });
  state.booking.paymentId = payment.paymentId || payment.id;
  state.booking.paymentStatus = payment.status;
  return payment;
}

export async function checkPaymentStatus(paymentId) {
  return apiGet(`/payments/${paymentId}`);
}

export async function redeemVoucher(bookingId) {
  if (!state.booking.voucherCode) return null;
  return apiPost('/voucher-redemption', { bookingId, voucherCode: state.booking.voucherCode, userId: state.user?.id });
}

export function restoreCheckoutFromURL() {
  const p = new URLSearchParams(location.search);
  if (!p.get('roomId')) return false;
  const nights = nightsBetween(p.get('checkin'), p.get('checkout'));
  const rate = Number(p.get('price')) || 0;
  Object.assign(state.booking, { roomId: p.get('roomId'), roomName: p.get('roomName') ?? '', roomType: p.get('roomType') ?? '', roomImgUrl: p.get('roomImg') ?? '', nightlyRate: rate, checkinDate: p.get('checkin') ?? '', checkoutDate: p.get('checkout') ?? '', guestsCount: Number(p.get('guests')) || 1, nights, subtotal: nights * rate, totalAmount: nights * rate, discountAmount: 0 });
  return true;
}

export function recalcTotal() {
  const nights = nightsBetween(getVal('booking-checkin'), getVal('booking-checkout'));
  if (nights <= 0) return false;
  state.booking.checkinDate = getVal('booking-checkin');
  state.booking.checkoutDate = getVal('booking-checkout');
  state.booking.nights = nights;
  state.booking.subtotal = nights * state.booking.nightlyRate;
  state.booking.totalAmount = Math.max(0, state.booking.subtotal - state.booking.discountAmount);
  return true;
}

export async function calculatePriceFromAPI() {
  const checkin = getVal('booking-checkin');
  const checkout = getVal('booking-checkout');
  const guests = Number(getVal('booking-guests-count')) || 1;
  if (!state.booking.roomId || !checkin || !checkout) return null;
  try {
    const result = await apiPost('/bookings/calculate-price', {
      roomId: state.booking.roomId,
      checkInDate: checkin,
      checkOutDate: checkout,
      numberOfGuests: guests,
      voucherCode: state.booking.voucherCode || undefined,
    });
    if (result) {
      state.booking.nights = result.numberOfNights ?? state.booking.nights;
      state.booking.subtotal = result.roomPrice ?? state.booking.subtotal;
      state.booking.nightlyRate = result.pricePerNight ?? state.booking.nightlyRate;
      state.booking.discountAmount = result.discountAmount ?? 0;
      state.booking.totalAmount = result.totalPrice ?? state.booking.totalAmount;
    }
    return result;
  } catch {
    return null;
  }
}

export function isAuthenticated() { return Boolean(getToken()); }
