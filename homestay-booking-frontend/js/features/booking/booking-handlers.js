import { state } from '../../core/state.js';
import { getVal, nightsBetween, setBtnLoading, setText, toast, fmtVND } from '../../shared/utils.js';
import { calculatePriceFromAPI, createBooking, isAuthenticated, markTransferred, recalcTotal, validateVoucherAPI, redeemVoucher } from './booking-logic.js';
import { onPaymentSuccess, refreshSummary } from './booking-render.js';

export function validateCheckoutForm() {
  if (!isAuthenticated()) { toast('Vui lòng đăng nhập để đặt phòng.', 'warning'); return false; }
  if (!state.booking.roomId) { toast('Vui lòng chọn phòng trước.', 'warning'); return false; }
  if (nightsBetween(getVal('booking-checkin'), getVal('booking-checkout')) <= 0) {
    document.getElementById('booking-date-error')?.classList.remove('d-none');
    return false;
  }
  return true;
}

export async function applyVoucher() {
  const code = getVal('voucher-input').trim().toUpperCase();
  if (!code) { toast('Vui lòng nhập mã voucher.', 'warning'); return; }
  setBtnLoading('btn-apply-voucher', true);
  try {
    const voucher = await validateVoucherAPI(code);
    state.booking.voucherCode = code;
    state.booking.voucherId = voucher.voucherId;
    state.booking.discountAmount = voucher.discountAmount ?? (voucher.type === 'percent'
      ? Math.floor(state.booking.subtotal * voucher.value / 100)
      : Math.min(voucher.value, state.booking.subtotal));
    state.booking.totalAmount = Math.max(0, state.booking.subtotal - state.booking.discountAmount);
    setText('voucher-success-msg', `${voucher.description} — Đã giảm:`);
    setText('voucher-discount-display', fmtVND(state.booking.discountAmount));
    setText('voucher-code-display', code);
    document.getElementById('voucher-success')?.classList.remove('d-none');
    document.getElementById('discount-row-container')?.classList.remove('d-none');
    refreshSummary();
  } catch { toast('Mã voucher không hợp lệ hoặc đã hết hạn.', 'danger'); }
  finally { setBtnLoading('btn-apply-voucher', false); }
}

export async function openTransferModal() {
  if (!validateCheckoutForm()) return;
  setBtnLoading('btn-pay-transfer', true);
  try {
    const bookingResult = await createBooking();
    state.booking.bookingId = bookingResult.id || bookingResult.bookingId;
    state.booking.totalAmount = bookingResult.totalPrice || bookingResult.totalAmount || state.booking.totalAmount;
    state.booking._pendingResult = bookingResult;

    const amount  = state.booking.totalAmount;
    const content = `DATPHONG ${(state.booking.bookingId ?? '').slice(-8).toUpperCase()}`;

    setText('modal-amount', fmtVND(amount));
    setText('modal-transfer-content', content);

    const qrImg = document.getElementById('modal-qr-img');
    if (qrImg) {
      qrImg.src = `https://img.vietqr.io/image/MB-15151205051601-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent('FISHSAUCE HOMESTAY')}`;
    }

    new bootstrap.Modal(document.getElementById('modal-transfer')).show();
  } catch (err) {
    toast(err.message || 'Có lỗi xảy ra, vui lòng thử lại.', 'danger');
  } finally {
    setBtnLoading('btn-pay-transfer', false);
  }
}

export async function confirmTransfer() {
  const spinner = document.getElementById('spinner-confirm-transfer');
  const btn     = document.getElementById('btn-confirm-transfer');
  if (btn) btn.disabled = true;
  spinner?.classList.remove('d-none');
  try {
    if (state.booking.voucherCode) {
      await redeemVoucher(state.booking.bookingId).catch(() => {});
    }
    await markTransferred(state.booking.bookingId);
    bootstrap.Modal.getInstance(document.getElementById('modal-transfer'))?.hide();
    onPaymentSuccess(state.booking._pendingResult || { id: state.booking.bookingId });
  } catch (err) {
    toast(err.message || 'Có lỗi xảy ra.', 'danger');
  } finally {
    if (btn) btn.disabled = false;
    spinner?.classList.add('d-none');
  }
}

export function bindBookingHandlers() {
  document.getElementById('btn-apply-voucher')?.addEventListener('click', applyVoucher);
  document.getElementById('btn-pay-transfer')?.addEventListener('click', openTransferModal);
  document.getElementById('btn-confirm-transfer')?.addEventListener('click', confirmTransfer);
  ['booking-checkin', 'booking-checkout', 'booking-guests-count'].forEach((id) =>
    document.getElementById(id)?.addEventListener('change', async () => {
      // Try API price calculation first; fallback to local recalc
      const apiResult = await calculatePriceFromAPI();
      if (apiResult) { refreshSummary(); return; }
      if (recalcTotal()) refreshSummary();
    })
  );
}
