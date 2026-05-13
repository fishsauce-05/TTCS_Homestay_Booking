import { fmtDate, fmtVND, statusLabel } from '../../shared/utils.js';

export function renderMyBookings(bookings) {
  const box = document.getElementById('my-bookings-list');
  if (!box) return;
  if (!bookings?.length) { box.innerHTML = '<div class="text-muted text-center py-5">Bạn chưa có lịch đặt phòng nào.</div>'; return; }
  box.innerHTML = bookings.map((b) => {
    const actions = [];
    if (b.status === 'pending') actions.push(`<button class="btn btn-sm btn-outline-danger mt-1" data-cancel-booking="${b.id}">Hủy</button>`);
    if (b.status === 'completed') {
      const homestayId = b.room?.homestayId ?? b.homestayId ?? '';
      actions.push(`<button class="btn btn-sm btn-brand-outline mt-1" data-write-review="${b.id}" data-homestay-id="${homestayId}"><i class="bi bi-star me-1"></i>Đánh giá</button>`);
      actions.push(`<button class="btn btn-sm btn-outline-secondary mt-1 ms-1" data-view-invoice="${b.id}"><i class="bi bi-receipt me-1"></i>Hoá đơn</button>`);
    }
    return `<div class="booking-list-item mb-3"><div class="flex-grow-1"><div class="fw-600">${b.room?.name ?? b.roomId ?? '—'}</div><div class="text-muted small">${fmtDate(b.checkInDate)} → ${fmtDate(b.checkOutDate)} (${b.numberOfNights ?? '?'} đêm)</div><div class="text-muted small">Mã: ${b.bookingCode ?? b.id ?? '—'}</div></div><div class="text-end"><span class="badge status-${b.status ?? 'pending'}">${statusLabel(b.status)}</span><div class="mt-1 text-brand fw-600 small">${fmtVND(b.totalPrice ?? 0)}</div>${actions.join('')}</div></div>`;
  }).join('');
}

export function renderMyInvoices(invoices) {
  const box = document.getElementById('my-invoices-list');
  if (!box) return;
  if (!invoices?.length) { box.innerHTML = '<div class="text-muted text-center py-5"><i class="bi bi-receipt fs-1 d-block mb-3"></i>Chưa có hoá đơn nào.</div>'; return; }
  box.innerHTML = `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Phòng</th><th>Homestay</th><th>Check-in</th><th>Check-out</th><th>Tổng tiền</th><th>Ngày TT</th></tr></thead><tbody>${invoices.map((inv) => `<tr><td class="fw-600">${inv.roomName ?? '—'}</td><td>${inv.homestayName ?? '—'}</td><td>${fmtDate(inv.checkInDate)}</td><td>${fmtDate(inv.checkOutDate)}</td><td class="text-brand fw-600">${fmtVND(inv.totalAmount ?? 0)}</td><td>${inv.paymentDate ? fmtDate(inv.paymentDate) : '—'}</td></tr>`).join('')}</tbody></table></div>`;
}

export function renderInvoiceModal(inv) {
  if (!inv) return;
  const modal = document.getElementById('invoice-detail-modal');
  if (modal) {
    document.getElementById('inv-room-name').textContent = inv.roomName ?? '—';
    document.getElementById('inv-homestay-name').textContent = inv.homestayName ?? '—';
    document.getElementById('inv-checkin').textContent = fmtDate(inv.checkInDate);
    document.getElementById('inv-checkout').textContent = fmtDate(inv.checkOutDate);
    document.getElementById('inv-nights').textContent = inv.numberOfNights ?? '—';
    document.getElementById('inv-price-per-night').textContent = fmtVND(inv.pricePerNight ?? 0);
    document.getElementById('inv-room-price').textContent = fmtVND(inv.roomPrice ?? 0);
    document.getElementById('inv-discount').textContent = fmtVND(inv.discountAmount ?? 0);
    document.getElementById('inv-total').textContent = fmtVND(inv.totalAmount ?? 0);
    document.getElementById('inv-payment-date').textContent = inv.paymentDate ? fmtDate(inv.paymentDate) : '—';
    new bootstrap.Modal(modal).show();
  }
}
