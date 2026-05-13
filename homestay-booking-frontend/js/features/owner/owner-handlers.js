import { getVal, setVal, toast } from '../../shared/utils.js';
import * as logic from './owner-logic.js';
import { populateHomestaySelects, renderOwnerBookings, renderOwnerBankAccount, renderOwnerHomestays, renderOwnerPayments, renderOwnerPricing, renderOwnerReviews, renderOwnerRooms, renderOwnerStats, renderRoomBookings, renderRoomStats } from './owner-render.js';

const ALL_OWNER_TABS = ['homestays', 'rooms', 'pricing', 'bookings', 'payments', 'owner-stats', 'reviews', 'bank-account'];

let _currentHomestayForReviews = null;
let _currentHomestayForRoomStats = null;
let _lastRoomStatsData = [];
let _bankAccountExists = false;

let _roomImages = [];

export const getRoomImages = () => _roomImages;

export function setRoomImages(arr) {
  _roomImages = Array.isArray(arr) ? [...arr] : [];
  renderRoomImagePreviews();
}

function renderRoomImagePreviews() {
  const box = document.getElementById('r-images-preview');
  if (!box) return;
  if (_roomImages.length === 0) { box.innerHTML = ''; return; }
  box.innerHTML = _roomImages.map((url, i) => `
    <div class="position-relative" style="width:72px;flex-shrink:0">
      <img src="${url}" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:6px;border:1px solid var(--border-color);display:block" onerror="this.style.background='var(--brand-light)'" />
      <button type="button" data-remove-img="${i}" style="position:absolute;top:-5px;right:-5px;background:rgba(30,20,10,.65);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:11px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0">×</button>
    </div>`).join('');
}

export async function loadHomestays() {
  try {
    const list = await logic.fetchOwnerHomestays();
    renderOwnerHomestays(list);
    // Also populate review homestay select
    const opts = list.map((hs) => `<option value="${hs.id}">${hs.title ?? hs.name ?? hs.id}</option>`).join('');
    const reviewSel = document.getElementById('owner-reviews-homestay-filter');
    if (reviewSel) reviewSel.innerHTML = '<option value="">-- Chọn homestay --</option>' + opts;
  } catch (e) { toast(e.message, 'danger'); }
}
export async function loadRooms() { const id = getVal('owner-room-homestay-filter'); if (!id) return; try { renderOwnerRooms(await logic.fetchOwnerRooms(id)); } catch (e) { toast(e.message, 'danger'); } }
export async function loadPricing() { const id = getVal('owner-pricing-room-filter'); if (!id) return; try { renderOwnerPricing(await logic.fetchOwnerPricing(id)); } catch (e) { toast(e.message, 'danger'); } }
export async function loadBookings() { const id = getVal('owner-booking-homestay-filter'); if (!id) return; try { renderOwnerBookings(await logic.fetchOwnerBookings(id)); } catch (e) { toast(e.message, 'danger'); } }
export async function loadPayments() { try { renderOwnerPayments(await logic.fetchOwnerPayments()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadStats() {
  try {
    const data = await logic.fetchOwnerStats(getVal('owner-stats-start'), getVal('owner-stats-end'));
    renderOwnerStats(data);
    document.getElementById('owner-room-stats-list')?.classList.add('d-none');
  } catch (e) { toast(e.message, 'danger'); }
}
export async function loadOwnerReviews() {
  const id = getVal('owner-reviews-homestay-filter');
  if (!id) return;
  _currentHomestayForReviews = id;
  try { renderOwnerReviews(await logic.fetchOwnerReviews(id)); } catch (e) { toast(e.message, 'danger'); }
}
export async function loadBankAccount() {
  try {
    const account = await logic.fetchMyBankAccount();
    _bankAccountExists = !!account;
    renderOwnerBankAccount(account);
    document.getElementById('owner-bank-form-wrap')?.classList.toggle('d-none', !!account);
  } catch {
    _bankAccountExists = false;
    renderOwnerBankAccount(null);
    document.getElementById('owner-bank-form-wrap')?.classList.remove('d-none');
  }
}

export function ownerTab(name) {
  ALL_OWNER_TABS.forEach((t) => document.getElementById(`owner-tab-${t}`)?.classList.toggle('d-none', t !== name));
  if (name === 'homestays') loadHomestays();
  if (name === 'payments') loadPayments();
  if (name === 'reviews') { loadHomestays(); }
  if (name === 'bank-account') loadBankAccount();
}

export function bindOwnerHandlers() {
  document.querySelectorAll('#ownerTabs .nav-link').forEach((btn, i) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ownerTabs .nav-link').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      ownerTab(ALL_OWNER_TABS[i] ?? 'homestays');
    })
  );

  document.getElementById('owner-room-homestay-filter')?.addEventListener('change', loadRooms);
  document.getElementById('owner-pricing-room-filter')?.addEventListener('change', loadPricing);
  document.getElementById('owner-booking-homestay-filter')?.addEventListener('change', loadBookings);
  document.querySelector('#owner-tab-owner-stats .btn-brand')?.addEventListener('click', loadStats);
  document.getElementById('owner-reviews-homestay-filter')?.addEventListener('change', loadOwnerReviews);
  document.getElementById('btn-refresh-owner-payments')?.addEventListener('click', loadPayments);

  // Bank account save
  document.getElementById('btn-save-bank-account')?.addEventListener('click', async () => {
    const body = { bankName: getVal('bank-name'), accountNumber: getVal('bank-account-number'), accountHolderName: getVal('bank-holder-name') };
    if (!body.bankName || !body.accountNumber || !body.accountHolderName) { toast('Vui lòng điền đầy đủ thông tin.', 'warning'); return; }
    try {
      await logic.saveBankAccount(body, _bankAccountExists);
      toast('Đã lưu tài khoản ngân hàng.', 'success');
      await loadBankAccount();
    } catch (e) { toast(e.message, 'danger'); }
  });

  document.getElementById('btn-edit-bank-account')?.addEventListener('click', () => {
    document.getElementById('owner-bank-form-wrap')?.classList.remove('d-none');
  });

  document.getElementById('btn-delete-bank-account')?.addEventListener('click', async () => {
    if (!confirm('Xóa tài khoản ngân hàng này?')) return;
    try {
      await logic.deleteMyBankAccount();
      toast('Đã xóa tài khoản ngân hàng.', 'success');
      _bankAccountExists = false;
      await loadBankAccount();
    } catch (e) { toast(e.message, 'danger'); }
  });

  document.getElementById('btn-add-room-image')?.addEventListener('click', () => {
    const input = document.getElementById('r-image-url-input');
    const url = input?.value?.trim();
    if (!url) return;
    _roomImages.push(url);
    renderRoomImagePreviews();
    if (input) input.value = '';
  });

  document.getElementById('r-image-url-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('btn-add-room-image')?.click(); }
  });

  document.addEventListener('click', async (e) => {
    try {
      // Remove image preview
      const removeImg = e.target.closest('[data-remove-img]');
      if (removeImg) { _roomImages.splice(Number(removeImg.dataset.removeImg), 1); renderRoomImagePreviews(); return; }

      // Edit room — populate form
      const editRoom = e.target.closest('[data-edit-room]');
      if (editRoom) {
        const d = editRoom.dataset;
        setVal('r-editing-id', d.editRoom);
        setVal('r-homestay-id', d.roomHomestay);
        setVal('r-name', d.roomName);
        setVal('r-type', d.roomType);
        setVal('r-capacity', d.roomCapacity);
        setVal('r-base-price', d.roomPrice);
        setVal('r-status', d.roomStatus ?? 'ACTIVE');
        setVal('r-description', d.roomDesc ?? '');
        setRoomImages(JSON.parse(d.roomImages?.replace(/&quot;/g, '"') ?? '[]'));
        document.getElementById('room-form-title').textContent = 'Chỉnh sửa phòng';
        const wrap = document.getElementById('room-form-wrap');
        wrap?.classList.remove('d-none');
        wrap?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Homestay CRUD
      const hs = e.target.closest('[data-delete-homestay]');
      if (hs && confirm('Xóa homestay này?')) { await logic.deleteHomestayApi(hs.dataset.deleteHomestay); await loadHomestays(); return; }

      // Room CRUD
      const room = e.target.closest('[data-delete-room]');
      if (room && confirm('Xóa phòng này?')) { await logic.deleteRoomApi(room.dataset.deleteRoom); await loadRooms(); return; }

      // Pricing CRUD
      const ps = e.target.closest('[data-delete-pricing]');
      if (ps && confirm('Xóa lịch giá này?')) { await logic.deletePricingApi(ps.dataset.deletePricing); await loadPricing(); return; }

      // Confirm booking
      const confirmB = e.target.closest('[data-confirm-booking]');
      if (confirmB) { await logic.confirmOwnerBooking(confirmB.dataset.confirmBooking); toast('Đã xác nhận đặt phòng.', 'success'); await loadBookings(); return; }

      // Complete booking
      const completeB = e.target.closest('[data-complete-booking]');
      if (completeB) { await logic.completeOwnerBooking(completeB.dataset.completeBooking); toast('Đã hoàn thành đặt phòng.', 'success'); await loadBookings(); return; }

      // Payment approval
      const approvePayment = e.target.closest('[data-approve-payment]');
      if (approvePayment) { await logic.approvePayment(approvePayment.dataset.approvePayment); toast('Đã xác nhận thanh toán.', 'success'); await loadPayments(); return; }

      const rejectPayment = e.target.closest('[data-reject-payment]');
      if (rejectPayment) {
        const reason = prompt('Lý do từ chối xác nhận thanh toán:') || undefined;
        await logic.rejectPayment(rejectPayment.dataset.rejectPayment, reason);
        toast('Đã từ chối xác nhận thanh toán.', 'success');
        await loadPayments();
        return;
      }

      // Reply to review
      const replyBtn = e.target.closest('[data-reply-review]');
      if (replyBtn) {
        const current = replyBtn.dataset.currentReply || '';
        const reply = prompt('Nhập phản hồi của bạn:', current);
        if (reply === null) return;
        await logic.replyToReview(replyBtn.dataset.replyReview, reply);
        toast('Đã gửi phản hồi.', 'success');
        if (_currentHomestayForReviews) await loadOwnerReviews();
        return;
      }

      // Delete review (owner can delete reviews on their homestay)
      const delReview = e.target.closest('[data-owner-delete-review]');
      if (delReview && confirm('Xóa đánh giá này?')) {
        await logic.deleteReviewApi(delReview.dataset.ownerDeleteReview);
        toast('Đã xóa đánh giá.', 'success');
        if (_currentHomestayForReviews) await loadOwnerReviews();
        return;
      }

      // View room stats for a homestay
      const viewRoomStats = e.target.closest('[data-view-room-stats]');
      if (viewRoomStats) {
        const homestayId = viewRoomStats.dataset.viewRoomStats;
        _currentHomestayForRoomStats = homestayId;
        const roomStatsBox = document.getElementById('owner-room-stats-list');
        if (roomStatsBox) roomStatsBox.classList.remove('d-none');
        try {
          const data = await logic.fetchRoomRevenue(homestayId, getVal('owner-stats-start'), getVal('owner-stats-end'));
          _lastRoomStatsData = data;
          renderRoomStats(data, homestayId);
        } catch (e) { toast(e.message, 'danger'); }
        return;
      }

      // View bookings for a specific room
      const viewRoomBookings = e.target.closest('[data-view-room-bookings]');
      if (viewRoomBookings) {
        const roomId = viewRoomBookings.dataset.viewRoomBookings;
        const roomName = viewRoomBookings.closest('tr')?.querySelector('td')?.textContent ?? roomId;
        try {
          const data = await logic.fetchRoomBookings(roomId, getVal('owner-stats-start'), getVal('owner-stats-end'));
          renderRoomBookings(data, roomName);
        } catch (e) { toast(e.message, 'danger'); }
        return;
      }

      // Back to homestay stats
      const backToHomestay = e.target.closest('#btn-back-to-homestay-stats');
      if (backToHomestay) { await loadStats(); return; }

      // Back to room stats
      const backToRoomStats = e.target.closest('#btn-back-to-room-stats');
      if (backToRoomStats && _currentHomestayForRoomStats) {
        renderRoomStats(_lastRoomStatsData, _currentHomestayForRoomStats);
        return;
      }

    } catch (err) { toast(err.message, 'danger'); }
  });
}
