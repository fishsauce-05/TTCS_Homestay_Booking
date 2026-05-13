import { state } from '../../core/state.js';
import { fmtDate, fmtVND, placeholder, setText, setVal } from '../../shared/utils.js';

export function populateCheckout() {
  const b = state.booking;
  setVal('booking-checkin', b.checkinDate);
  setVal('booking-checkout', b.checkoutDate);
  setVal('booking-guests-count', b.guestsCount ?? 1);
  setText('summary-room-name', b.roomName);
  setText('summary-room-type', b.roomType);
  const imgWrap = document.getElementById('summary-room-img');
  if (imgWrap) { imgWrap.innerHTML = `<img src="${b.roomImgUrl || placeholder(80, 65)}" alt="${b.roomName}" />`; imgWrap.classList.remove('skeleton-summary-img'); }
  refreshSummary();
}

export function refreshSummary() {
  const b = state.booking;
  setText('summary-base-price', fmtVND(b.nightlyRate));
  setText('summary-nights', `${b.nights} đêm`);
  setText('summary-subtotal', b.nights > 0 ? fmtVND(b.subtotal) : '—');
  setText('summary-discount', b.discountAmount ? `-${fmtVND(b.discountAmount)}` : '—');
  setText('summary-total', b.nights > 0 ? fmtVND(b.totalAmount) : '—');
}

export function refreshQR(amount) {
  const qr = document.getElementById('qr-payment-img');
  if (qr) { qr.src = `https://img.vietqr.io/image/MB-15151205051601-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(`Dat phong Fishsauce Homestay ${state.booking.roomId}`)}`; qr.classList.remove('skeleton-qr'); }
}

export function showPaymentStatus(status, actionOrMessage) {
  const statusSection = document.getElementById('section-payment-status');
  const statusBadge = document.getElementById('payment-status-badge');
  const statusMsg = document.getElementById('payment-status-msg');
  const paymentInstructions = document.getElementById('payment-instructions');
  
  if (!statusSection) return;
  
  // Update badge and message
  if (statusBadge) {
    statusBadge.className = 'badge';
    statusBadge.textContent = ({
      'pending': 'Chờ xử lý',
      'initiated': 'Sẵn sàng thanh toán',
      'processing': 'Đang xử lý',
      'success': 'Thành công',
      'failed': 'Thất bại'
    })[status] || 'Không xác định';
    statusBadge.classList.add(({
      'pending': 'bg-secondary',
      'initiated': 'bg-info',
      'processing': 'bg-warning text-dark',
      'success': 'bg-success',
      'failed': 'bg-danger'
    })[status] || 'bg-secondary');
  }
  
  if (statusMsg) statusMsg.textContent = typeof actionOrMessage === 'string' ? actionOrMessage : 'Đang xử lý...';
  
  // Show payment instructions if QR or redirect
  if (paymentInstructions && actionOrMessage?.type) {
    if (actionOrMessage.type === 'qr') {
      paymentInstructions.innerHTML = `
        <div class="text-center">
          <p class="mb-3">Quét mã QR dưới đây để thanh toán:</p>
          <img src="${actionOrMessage.data}" alt="QR Code" class="img-fluid" style="max-width: 300px;" />
          <p class="small text-muted mt-3">Số tiền: <strong>${fmtVND(state.booking.totalAmount)}</strong></p>
        </div>
      `;
    } else if (actionOrMessage.type === 'redirect') {
      paymentInstructions.innerHTML = `
        <div class="alert alert-info">
          <p>Vui lòng nhấp vào liên kết dưới đây để hoàn tất thanh toán:</p>
          <a href="${actionOrMessage.data}" target="_blank" class="btn btn-primary">Đi đến thanh toán</a>
        </div>
      `;
    }
    paymentInstructions.classList.remove('d-none');
  }
  
  // Show status section if not already visible
  if (status !== 'pending') {
    statusSection?.classList.remove('d-none');
  }
}

export function onPaymentSuccess(result) {
  state.booking.bookingId = result.id || result.bookingId;
  setText('success-booking-code', result.bookingCode ?? result.id ?? '—');
  const totalAmount = result.totalPrice ?? state.booking.totalAmount;
  const sum = document.getElementById('success-summary');
  if (sum) sum.innerHTML = `
    <div class="price-row"><span>Phòng</span><strong>${state.booking.roomName || result.room?.name || '—'}</strong></div>
    <div class="price-row"><span>Check-in</span><strong>${fmtDate(result.checkInDate ?? state.booking.checkinDate)}</strong></div>
    <div class="price-row"><span>Check-out</span><strong>${fmtDate(result.checkOutDate ?? state.booking.checkoutDate)}</strong></div>
    <div class="price-row"><span>Thanh toán</span><strong class="text-warning">Chờ chủ homestay xác nhận</strong></div>
    <div class="price-row price-subtotal"><span>Tổng</span><strong>${fmtVND(totalAmount)}</strong></div>
  `;
  document.getElementById('section-checkout')?.classList.remove('active');
  document.getElementById('section-payment-status')?.classList.add('d-none');
  document.getElementById('section-booking-success')?.classList.add('active');
}

export function onBookingSuccess(result) {
  setText('success-booking-code', result.bookingCode ?? result.id ?? '—');
  const totalAmount = result.totalPrice ?? state.booking.totalAmount;
  const sum = document.getElementById('success-summary');
  if (sum) sum.innerHTML = `<div class="price-row"><span>Phòng</span><strong>${state.booking.roomName || result.room?.name || '—'}</strong></div><div class="price-row"><span>Check-in</span><strong>${fmtDate(result.checkInDate ?? state.booking.checkinDate)}</strong></div><div class="price-row"><span>Check-out</span><strong>${fmtDate(result.checkOutDate ?? state.booking.checkoutDate)}</strong></div><div class="price-row price-subtotal"><span>Tổng</span><strong>${fmtVND(totalAmount)}</strong></div>`;
  document.getElementById('section-checkout')?.classList.remove('active');
  document.getElementById('section-booking-success')?.classList.add('active');
}
