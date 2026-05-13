import { fmtDate, fmtVND, setText, statusLabel } from '../../shared/utils.js';

const HOMESTAY_STATUS_LABEL = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', suspended: 'Tạm ngừng', PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối', SUSPENDED: 'Tạm ngừng' };
const HOMESTAY_STATUS_BADGE = { pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger', suspended: 'bg-secondary', PENDING: 'bg-warning text-dark', APPROVED: 'bg-success', REJECTED: 'bg-danger', SUSPENDED: 'bg-secondary' };
const PAYMENT_STATUS_BADGE = { pending: 'bg-secondary', waiting_owner_approval: 'bg-warning text-dark', completed: 'bg-success', rejected: 'bg-danger', PENDING: 'bg-secondary', WAITING_OWNER_APPROVAL: 'bg-warning text-dark', COMPLETED: 'bg-success', REJECTED: 'bg-danger' };

export function renderAdminUsers(users = []) {
  const box = document.getElementById('admin-users-list');
  if (!box) return;
  box.innerHTML = users.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>${users.map((u) => `<tr>
          <td class="fw-600">${u.fullName ?? '—'}</td>
          <td>${u.email ?? ''}</td>
          <td>${u.phone ?? '—'}</td>
          <td><span class="badge bg-secondary">${u.role ?? ''}</span></td>
          <td>${u.isLocked ? '<span class="badge bg-danger">Đã khóa</span>' : '<span class="badge bg-success">Hoạt động</span>'}</td>
          <td class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-outline-primary" data-edit-user="${u.id}" title="Sửa"><i class="bi bi-pencil"></i></button>
            ${u.isLocked
              ? `<button class="btn btn-sm btn-outline-success" data-unlock-user="${u.id}" title="Mở khóa"><i class="bi bi-unlock"></i></button>`
              : `<button class="btn btn-sm btn-outline-warning" data-lock-user="${u.id}" title="Khóa"><i class="bi bi-lock"></i></button>`}
            <button class="btn btn-sm btn-outline-danger" data-delete-user="${u.id}" title="Xóa"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Không tìm thấy người dùng nào.</div>';
}

export function renderPendingOwners(owners = []) {
  const box = document.getElementById('admin-owners-list');
  if (!box) return;
  box.innerHTML = owners.length ? owners.map((u) => `<div class="booking-list-item mb-3"><div class="flex-grow-1"><div class="fw-600">${u.fullName ?? '—'}</div><div class="text-muted small">${u.email ?? ''} — ${u.phone ?? '—'}</div><div class="text-muted small">Đăng ký: ${fmtDate(u.createdAt)}</div></div><button class="btn btn-brand btn-sm" data-approve-owner="${u.id}">Duyệt</button></div>`).join('') : '<div class="text-muted text-center py-4">Không có Owner nào chờ duyệt.</div>';
}

export function renderAdminVouchers(list = []) {
  const box = document.getElementById('admin-vouchers-list');
  if (!box) return;
  box.innerHTML = list.length ? `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Mã</th><th>Loại</th><th>Giá trị</th><th>Hết hạn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${list.map((v) => `<tr><td class="fw-600">${v.code}</td><td>${v.type === 'PERCENT' || v.type === 'percent' ? 'Phần trăm' : 'Cố định'}</td><td>${v.type === 'PERCENT' || v.type === 'percent' ? v.discountValue + '%' : fmtVND(v.discountValue)}</td><td>${fmtDate(v.expiryDate)}</td><td><span class="badge ${v.status === 'ACTIVE' || v.status === 'active' ? 'bg-success' : 'bg-secondary'}">${v.status === 'ACTIVE' || v.status === 'active' ? 'Đang hoạt động' : 'Tạm ngừng'}</span></td><td><button class="btn btn-sm btn-outline-warning" data-toggle-voucher="${v.id}" title="Bật/tắt"><i class="bi bi-toggle-on"></i></button><button class="btn btn-sm btn-outline-danger ms-1" data-delete-voucher="${v.id}" title="Xóa"><i class="bi bi-trash"></i></button></td></tr>`).join('')}</tbody></table></div>` : '<div class="text-muted text-center py-4">Chưa có voucher nào.</div>';
}

export function renderPlatformStats(data = {}) {
  setText('stat-total-bookings', data.totalBookings ?? '—');
  setText('stat-pending-bookings', data.pendingBookings ?? '—');
  setText('stat-total-revenue', data.totalRevenue != null ? fmtVND(data.totalRevenue) : '—');
  setText('stat-total-users', data.totalUsers ?? '—');
}

export function renderAdminRevenue(data = []) {
  const box = document.getElementById('admin-stats-list');
  if (!box) return;
  box.innerHTML = data.length ? `<div class="table-responsive"><table class="table table-hover align-middle small"><thead><tr><th>Homestay</th><th>Đặt phòng</th><th>Doanh thu</th></tr></thead><tbody>${data.map((r) => `<tr><td>${r.homestayName ?? '—'}</td><td>${r.bookingCount ?? 0}</td><td class="fw-600 text-brand">${fmtVND(r.totalRevenue ?? 0)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="text-muted text-center py-4">Không có dữ liệu.</div>';
}

export function renderAdminHomestays(list = []) {
  const box = document.getElementById('admin-homestays-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Tên</th><th>Địa chỉ</th><th>Chủ nhà</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>${list.map((hs) => `<tr>
          <td class="fw-600">${hs.title ?? hs.name ?? '—'}</td>
          <td>${hs.address ?? '—'}</td>
          <td>${hs.user?.fullName ?? hs.userId ?? '—'}</td>
          <td><span class="badge ${HOMESTAY_STATUS_BADGE[hs.status] ?? 'bg-secondary'}">${HOMESTAY_STATUS_LABEL[hs.status] ?? hs.status ?? '—'}</span></td>
          <td class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-outline-success" data-approve-homestay="${hs.id}" title="Duyệt"><i class="bi bi-check-lg"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-reject-homestay="${hs.id}" title="Từ chối"><i class="bi bi-x-lg"></i></button>
            <button class="btn btn-sm btn-outline-warning" data-suspend-homestay="${hs.id}" title="Tạm ngừng"><i class="bi bi-pause-circle"></i></button>
          </td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Không có homestay nào.</div>';
}

export function renderAdminBookings(list = []) {
  const box = document.getElementById('admin-bookings-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Phòng</th><th>Khách</th><th>Check-in</th><th>Check-out</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>${list.map((b) => `<tr>
          <td class="fw-600">${b.room?.name ?? b.roomId ?? '—'}</td>
          <td>${b.user?.fullName ?? b.userId ?? '—'}</td>
          <td>${fmtDate(b.checkInDate)}</td>
          <td>${fmtDate(b.checkOutDate)}</td>
          <td class="text-brand fw-600">${fmtVND(b.totalPrice ?? 0)}</td>
          <td><span class="badge status-${b.status ?? 'pending'}">${statusLabel(b.status)}</span></td>
          <td class="d-flex gap-1 flex-wrap">
            ${b.status === 'confirmed' ? `<button class="btn btn-sm btn-outline-success" data-complete-booking="${b.id}" title="Hoàn thành"><i class="bi bi-check2-all"></i></button>` : ''}
            <button class="btn btn-sm btn-outline-danger" data-admin-delete-booking="${b.id}" title="Xóa"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Không có đặt phòng nào.</div>';
}

export function renderAdminPayments(list = []) {
  const box = document.getElementById('admin-payments-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Mã booking</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày TT</th><th>Thao tác</th></tr></thead>
        <tbody>${list.map((p) => `<tr>
          <td class="fw-600 text-muted small">${(p.bookingId ?? '').slice(0, 8)}…</td>
          <td class="text-brand fw-600">${fmtVND(p.amount ?? 0)}</td>
          <td><span class="badge ${PAYMENT_STATUS_BADGE[p.status] ?? 'bg-secondary'}">${p.status ?? '—'}</span></td>
          <td>${p.paidAt ? fmtDate(p.paidAt) : (p.createdAt ? fmtDate(p.createdAt) : '—')}</td>
          <td class="d-flex gap-1">
            ${p.status === 'waiting_owner_approval' || p.status === 'WAITING_OWNER_APPROVAL' ? `<button class="btn btn-sm btn-outline-success" data-approve-payment="${p.id}" title="Duyệt"><i class="bi bi-check-lg"></i></button><button class="btn btn-sm btn-outline-danger" data-reject-payment="${p.id}" title="Từ chối"><i class="bi bi-x-lg"></i></button>` : ''}
          </td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Không có thanh toán nào.</div>';
}

export function renderAdminAmenities(list = []) {
  const box = document.getElementById('admin-amenities-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Icon</th><th>Tên tiện nghi</th><th>Thao tác</th></tr></thead>
        <tbody>${list.map((a) => `<tr>
          <td><i class="${a.icon ?? 'bi bi-check-circle'}" style="font-size:1.3rem"></i></td>
          <td class="fw-600">${a.name ?? '—'}</td>
          <td class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-primary" data-edit-amenity="${a.id}" data-name="${a.name}" data-icon="${a.icon ?? ''}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-delete-amenity="${a.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Chưa có tiện nghi nào.</div>';
}

export function renderAdminBankAccounts(list = []) {
  const box = document.getElementById('admin-bank-accounts-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Chủ tài khoản</th><th>Ngân hàng</th><th>Số TK</th><th>Chủ nhà</th><th>Xác minh</th><th>Thao tác</th></tr></thead>
        <tbody>${list.map((ba) => `<tr>
          <td class="fw-600">${ba.accountHolderName ?? '—'}</td>
          <td>${ba.bankName ?? '—'}</td>
          <td>${ba.accountNumber ?? '—'}</td>
          <td>${ba.user?.fullName ?? ba.userId ?? '—'}</td>
          <td>${ba.isVerified ? '<span class="badge bg-success">Đã xác minh</span>' : '<span class="badge bg-warning text-dark">Chưa xác minh</span>'}</td>
          <td>${!ba.isVerified ? `<button class="btn btn-sm btn-outline-success" data-verify-bank="${ba.id}" title="Xác minh"><i class="bi bi-patch-check"></i> Xác minh</button>` : '<span class="text-muted small">—</span>'}</td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Chưa có tài khoản ngân hàng nào.</div>';
}

export function renderAdminInvoices(list = []) {
  const box = document.getElementById('admin-invoices-list');
  if (!box) return;
  box.innerHTML = list.length
    ? `<div class="table-responsive"><table class="table table-hover align-middle small">
        <thead><tr><th>Khách hàng</th><th>Phòng</th><th>Homestay</th><th>Check-in</th><th>Tổng tiền</th><th>Ngày TT</th></tr></thead>
        <tbody>${list.map((inv) => `<tr>
          <td class="fw-600">${inv.customerName ?? '—'}</td>
          <td>${inv.roomName ?? '—'}</td>
          <td>${inv.homestayName ?? '—'}</td>
          <td>${fmtDate(inv.checkInDate)}</td>
          <td class="text-brand fw-600">${fmtVND(inv.totalAmount ?? 0)}</td>
          <td>${inv.paymentDate ? fmtDate(inv.paymentDate) : '—'}</td>
        </tr>`).join('')}</tbody></table></div>`
    : '<div class="text-muted text-center py-4">Chưa có hoá đơn nào.</div>';
}
