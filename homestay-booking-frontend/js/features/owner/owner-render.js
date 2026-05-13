import { fmtDate, fmtVND, setVal, stars, statusLabel } from '../../shared/utils.js';

export function renderOwnerHomestays(list = []) {
  const box = document.getElementById('owner-homestays-list');
  if (!box) return;
  box.innerHTML = list.length ? list.map((hs) => `<div class="booking-list-item mb-3"><div class="flex-grow-1"><div class="fw-600">${hs.title ?? hs.name ?? '—'}</div><div class="text-muted small">${hs.address ?? ''}</div><span class="badge bg-secondary mt-1">${hs.status ?? ''}</span></div><button class="btn btn-sm btn-outline-danger" data-delete-homestay="${hs.id}"><i class="bi bi-trash"></i></button></div>`).join('') : '<div class="text-muted text-center py-4">Chưa có homestay nào.</div>';
  populateHomestaySelects(list);
}

export function populateHomestaySelects(list = []) {
  const opts = list.map((hs) => `<option value="${hs.id}">${hs.title ?? hs.name ?? hs.id}</option>`).join('');
  ['owner-room-homestay-filter', 'r-homestay-id', 'owner-booking-homestay-filter'].forEach((id) => { const el = document.getElementById(id); if (el) el.innerHTML = (id !== 'r-homestay-id' ? '<option value="">-- Chọn homestay --</option>' : '') + opts; });
}

export function renderOwnerRooms(list = []) {
  const box = document.getElementById('owner-rooms-list');
  if (!box) return;
  box.innerHTML = list.length ? list.map((r) => {
    const thumb = r.images?.[0] ?? r.thumbnail ?? '';
    const thumbHtml = thumb
      ? `<img src="${thumb}" alt="" style="width:52px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid var(--border-color)" class="me-2" />`
      : `<div style="width:52px;height:40px;border-radius:6px;flex-shrink:0;background:var(--brand-light);display:flex;align-items:center;justify-content:center" class="me-2"><i class="bi bi-image text-muted" style="font-size:.8rem"></i></div>`;
    const imagesAttr = JSON.stringify(r.images ?? []).replace(/"/g, '&quot;');
    return `<div class="booking-list-item mb-2">${thumbHtml}<div class="flex-grow-1"><div class="fw-600">${r.name}</div><div class="text-muted small">${r.roomType ?? ''} — ${r.capacity ?? '?'} khách — ${fmtVND(r.basePrice ?? 0)}/đêm</div></div><div class="d-flex gap-1"><button class="btn btn-sm btn-outline-secondary" data-edit-room="${r.id}" data-room-name="${r.name}" data-room-type="${r.roomType ?? ''}" data-room-capacity="${r.capacity ?? ''}" data-room-price="${r.basePrice ?? ''}" data-room-status="${r.status ?? 'ACTIVE'}" data-room-desc="${(r.description ?? '').replace(/"/g, '&quot;')}" data-room-homestay="${r.homestayId ?? ''}" data-room-images="${imagesAttr}" title="Chỉnh sửa"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" data-delete-room="${r.id}" title="Xóa"><i class="bi bi-trash"></i></button></div></div>`;
  }).join('') : '<div class="text-muted text-center py-4">Homestay này chưa có phòng nào.</div>';
  populateRoomSelects(list);
}

export function populateRoomSelects(list = []) {
  const opts = list.map((r) => `<option value="${r.id}">${r.name}</option>`).join('');
  ['owner-pricing-room-filter', 'ps-room-id'].forEach((id) => { const el = document.getElementById(id); if (el) el.innerHTML = (id === 'owner-pricing-room-filter' ? '<option value="">-- Chọn phòng --</option>' : '') + opts; });
}

export function renderOwnerPricing(list = []) {
  const box = document.getElementById('owner-pricing-list');
  if (!box) return;
  box.innerHTML = list.length ? `<div class="table-responsive"><table class="table table-hover align-middle small"><tbody>${list.map((ps) => `<tr><td>${fmtDate(ps.startDate)}</td><td>${fmtDate(ps.endDate)}</td><td>${fmtVND(ps.pricePerNight)}</td><td><button class="btn btn-sm btn-outline-danger" data-delete-pricing="${ps.id}"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>` : '<div class="text-muted text-center py-4">Phòng này chưa có lịch giá nào.</div>';
}

export function renderOwnerBookings(bookings = []) {
  const box = document.getElementById('owner-bookings-list');
  if (!box) return;
  box.innerHTML = bookings.length ? bookings.map((b) => {
    const actions = [];
    if (b.status === 'pending') actions.push(`<button class="btn btn-sm btn-brand mt-1" data-confirm-booking="${b.id}">Xác nhận</button>`);
    if (b.status === 'confirmed') actions.push(`<button class="btn btn-sm btn-outline-success mt-1" data-complete-booking="${b.id}"><i class="bi bi-check2-all me-1"></i>Hoàn thành</button>`);
    return `<div class="booking-list-item mb-3"><div class="flex-grow-1"><div class="fw-600">${b.room?.name ?? b.roomId ?? '—'}</div><div class="text-muted small">Khách: ${b.user?.fullName ?? '—'}</div><div class="text-muted small">${fmtDate(b.checkInDate)} → ${fmtDate(b.checkOutDate)}</div><div class="text-muted small">${fmtVND(b.totalPrice ?? 0)}</div></div><div class="text-end"><span class="badge status-${b.status ?? 'pending'}">${statusLabel(b.status)}</span>${actions.join('')}</div></div>`;
  }).join('') : '<div class="text-muted text-center py-4">Chưa có đặt phòng nào.</div>';
}

export function renderOwnerPayments(payments = []) {
  const box = document.getElementById('owner-payments-list');
  if (!box) return;
  box.innerHTML = payments.length ? payments.map((p) => {
    const waiting = p.status === 'waiting_owner_approval' || p.status === 'WAITING_OWNER_APPROVAL';
    const done = p.status === 'completed' || p.status === 'COMPLETED';
    return `<div class="booking-list-item mb-3">
      <div class="flex-grow-1">
        <div class="fw-600">${p.booking?.room?.name ?? p.bookingId ?? '—'}</div>
        <div class="text-muted small">Khách: ${p.booking?.user?.fullName ?? '—'}</div>
        <div class="text-muted small">Mã booking: ${(p.bookingId ?? '').slice(0, 8)}…</div>
        <div class="text-brand fw-600">${fmtVND(p.amount ?? 0)}</div>
      </div>
      <div class="text-end">
        <span class="badge ${waiting ? 'bg-warning text-dark' : done ? 'bg-success' : 'bg-secondary'}">${p.status ?? '—'}</span>
        ${waiting ? `<div class="d-flex gap-1 justify-content-end mt-2"><button class="btn btn-sm btn-outline-success" data-approve-payment="${p.id}"><i class="bi bi-check-lg me-1"></i>Duyệt</button><button class="btn btn-sm btn-outline-danger" data-reject-payment="${p.id}"><i class="bi bi-x-lg me-1"></i>Từ chối</button></div>` : ''}
      </div>
    </div>`;
  }).join('') : '<div class="text-muted text-center py-4">Chưa có thanh toán nào cần xác nhận.</div>';
}

export function renderOwnerStats(data = []) {
  const box = document.getElementById('owner-stats-list');
  if (!box) return;
  const total = data.reduce((sum, r) => sum + Number(r.totalRevenue ?? 0), 0);
  box.innerHTML = `<div class="checkout-card p-3 mb-3 text-center"><div class="fs-4 fw-700 text-brand">${fmtVND(total)}</div><div class="text-muted small">Tổng doanh thu</div></div>` + (data.length ? `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Homestay</th><th>Đặt phòng</th><th>Doanh thu</th><th></th></tr></thead><tbody>${data.map((r) => `<tr><td>${r.homestayName ?? '—'}</td><td>${r.bookingCount ?? 0}</td><td class="fw-600 text-brand">${fmtVND(r.totalRevenue ?? 0)}</td><td><button class="btn btn-sm btn-outline-primary" data-view-room-stats="${r.homestayId}"><i class="bi bi-graph-up"></i> Theo phòng</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="text-muted text-center py-4">Không có dữ liệu.</div>');
}

export function renderRoomStats(data = [], homestayId) {
  const box = document.getElementById('owner-room-stats-list');
  if (!box) return;
  const total = data.reduce((sum, r) => sum + Number(r.totalRevenue ?? 0), 0);
  const backBtn = `<button class="btn btn-outline-secondary btn-sm mb-3" id="btn-back-to-homestay-stats"><i class="bi bi-arrow-left me-1"></i>Quay lại</button>`;
  box.innerHTML = backBtn + (data.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Phòng</th><th>Đặt phòng</th><th>Doanh thu</th><th></th></tr></thead><tbody>${data.map((r) => `<tr><td class="fw-600">${r.roomName ?? '—'}</td><td>${r.bookingCount ?? 0}</td><td class="text-brand fw-600">${fmtVND(r.totalRevenue ?? 0)}</td><td><button class="btn btn-sm btn-outline-secondary" data-view-room-bookings="${r.roomId}"><i class="bi bi-calendar3"></i> Đặt phòng</button></td></tr>`).join('')}</tbody></table></div><div class="checkout-card p-3 text-center"><div class="fs-5 fw-700 text-brand">${fmtVND(total)}</div><div class="text-muted small">Tổng doanh thu</div></div>`
    : '<div class="text-muted text-center py-4">Không có dữ liệu phòng.</div>');
}

export function renderRoomBookings(data = [], roomName = '') {
  const box = document.getElementById('owner-room-stats-list');
  if (!box) return;
  const backBtn = `<button class="btn btn-outline-secondary btn-sm mb-3" id="btn-back-to-room-stats"><i class="bi bi-arrow-left me-1"></i>Quay lại</button>`;
  box.innerHTML = backBtn + `<h6 class="fw-600 mb-3">Đặt phòng — ${roomName}</h6>` + (data.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Khách</th><th>Check-in</th><th>Check-out</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>${data.map((b) => `<tr><td>${b.user?.fullName ?? '—'}</td><td>${fmtDate(b.checkInDate)}</td><td>${fmtDate(b.checkOutDate)}</td><td class="text-brand fw-600">${fmtVND(b.totalPrice ?? 0)}</td><td><span class="badge status-${b.status}">${statusLabel(b.status)}</span></td></tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Không có đặt phòng nào.</div>');
}

export function renderOwnerReviews(reviews = []) {
  const box = document.getElementById('owner-reviews-list');
  if (!box) return;
  box.innerHTML = reviews.length ? reviews.map((r) => {
    const author = r.user?.fullName ?? 'Ẩn danh';
    const replyHtml = r.ownerReply
      ? `<div class="mt-2 p-2 rounded" style="background:#f8f5f0;border-left:3px solid var(--color-brand,#b5835a)"><div class="small fw-600 text-brand mb-1">Phản hồi của bạn:</div><div class="small">${r.ownerReply}</div><button class="btn btn-sm btn-link text-muted p-0 mt-1 small" data-reply-review="${r.id}" data-current-reply="${r.ownerReply}">Sửa phản hồi</button></div>`
      : `<button class="btn btn-sm btn-outline-primary mt-2" data-reply-review="${r.id}" data-current-reply=""><i class="bi bi-reply me-1"></i>Trả lời</button>`;
    return `<div class="review-card mb-3" data-review-id="${r.id}"><div class="review-avatar">${author[0]}</div><div class="flex-grow-1"><div class="d-flex justify-content-between"><span class="review-author">${author}</span><span class="review-date small text-muted">${r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}</span></div><div class="text-warning small mb-1">${stars(r.rating ?? 5)}</div><p class="review-text mb-1">${r.comment ?? ''}</p>${replyHtml}</div></div>`;
  }).join('') : '<div class="text-muted text-center py-4">Homestay này chưa có đánh giá nào.</div>';
}

export function renderOwnerBankAccount(account) {
  const box = document.getElementById('owner-bank-account-display');
  if (!box) return;
  if (!account) {
    box.innerHTML = '<div class="text-muted text-center py-3"><i class="bi bi-bank fs-3 d-block mb-2"></i>Chưa có tài khoản ngân hàng nào được đăng ký.</div>';
    return;
  }
  box.innerHTML = `<div class="checkout-card p-3 mb-3"><div class="d-flex justify-content-between align-items-start"><div><div class="fw-600 fs-6">${account.accountHolderName ?? '—'}</div><div class="text-muted small mt-1">${account.bankName ?? '—'} — ${account.accountNumber ?? '—'}</div></div><div>${account.isVerified ? '<span class="badge bg-success">Đã xác minh</span>' : '<span class="badge bg-warning text-dark">Chưa xác minh</span>'}</div></div></div>`;
  setVal('bank-holder-name', account.accountHolderName ?? '');
  setVal('bank-name', account.bankName ?? '');
  setVal('bank-account-number', account.accountNumber ?? '');
}
