import { toast } from '../../shared/utils.js';
import { cancelMyBooking, createReview, fetchInvoiceByBooking, fetchMyBookings, fetchMyInvoices } from './my-bookings-logic.js';
import { renderInvoiceModal, renderMyBookings, renderMyInvoices } from './my-bookings-render.js';

const BOOKING_STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export async function filterMyBookings(status = 'all') {
  const box = document.getElementById('my-bookings-list');
  if (box) box.innerHTML = '<div class="booking-list-item skeleton-booking mb-3"></div><div class="booking-list-item skeleton-booking mb-3"></div>';
  try { renderMyBookings(await fetchMyBookings(status)); }
  catch { renderMyBookings([]); }
}

export async function loadMyInvoices() {
  const box = document.getElementById('my-invoices-list');
  if (box) box.innerHTML = '<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-brand"></div></div>';
  try { renderMyInvoices(await fetchMyInvoices()); }
  catch (e) { if (box) box.innerHTML = '<div class="text-muted text-center py-4">Không thể tải hoá đơn.</div>'; }
}

let selectedReviewRating = 5;

function initModalStars() {
  const container = document.getElementById('modal-star-rating');
  if (!container) return;
  selectedReviewRating = 5;
  container.querySelectorAll('.modal-star-btn').forEach((btn, i) => {
    btn.style.color = '#f5a623';
    btn.addEventListener('click', () => {
      selectedReviewRating = Number(btn.dataset.star);
      document.getElementById('modal-review-rating').value = selectedReviewRating;
      container.querySelectorAll('.modal-star-btn').forEach((b, j) => { b.style.color = j < selectedReviewRating ? '#f5a623' : '#ccc'; });
    });
  });
}

export function bindMyBookingsHandlers() {
  // Tab switching
  document.querySelectorAll('#bookingTabs .nav-link').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#bookingTabs .nav-link').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const isInvoiceTab = i === 5;
      document.getElementById('my-bookings-tab-list')?.classList.toggle('d-none', isInvoiceTab);
      document.getElementById('my-bookings-tab-invoices')?.classList.toggle('d-none', !isInvoiceTab);
      if (isInvoiceTab) { loadMyInvoices(); return; }
      filterMyBookings(BOOKING_STATUSES[i] ?? 'all');
    });
  });

  document.addEventListener('click', async (e) => {
    // Cancel booking
    const cancelBtn = e.target.closest('[data-cancel-booking]');
    if (cancelBtn) {
      const reason = prompt('Lý do hủy (tùy chọn):');
      if (reason === null) return;
      try { await cancelMyBooking(cancelBtn.dataset.cancelBooking, reason); toast('Đã hủy đặt phòng.', 'success'); filterMyBookings(); }
      catch (err) { toast(err.message, 'danger'); }
      return;
    }

    // Write review
    const reviewBtn = e.target.closest('[data-write-review]');
    if (reviewBtn) {
      const homestayId = reviewBtn.dataset.homestayId;
      document.getElementById('modal-review-homestay-id').value = homestayId;
      document.getElementById('modal-review-comment').value = '';
      document.getElementById('modal-review-rating').value = '5';
      initModalStars();
      new bootstrap.Modal(document.getElementById('reviewModal')).show();
      return;
    }

    // View invoice
    const invBtn = e.target.closest('[data-view-invoice]');
    if (invBtn) {
      try {
        const inv = await fetchInvoiceByBooking(invBtn.dataset.viewInvoice);
        renderInvoiceModal(inv);
      } catch (e) { toast('Không thể tải hoá đơn.', 'danger'); }
      return;
    }
  });

  // Submit review from modal
  document.getElementById('btn-submit-modal-review')?.addEventListener('click', async () => {
    const homestayId = document.getElementById('modal-review-homestay-id')?.value;
    const comment = document.getElementById('modal-review-comment')?.value?.trim();
    const rating = Number(document.getElementById('modal-review-rating')?.value ?? 5);
    if (!comment) { toast('Vui lòng nhập nhận xét.', 'warning'); return; }
    if (!homestayId) { toast('Không xác định được homestay.', 'warning'); return; }
    const btn = document.getElementById('btn-submit-modal-review');
    btn.disabled = true;
    btn.querySelector('.spinner-border')?.classList.remove('d-none');
    try {
      await createReview(homestayId, rating, comment);
      bootstrap.Modal.getInstance(document.getElementById('reviewModal'))?.hide();
      toast('Đã gửi đánh giá thành công!', 'success');
    } catch (err) { toast(err.message, 'danger'); }
    finally {
      btn.disabled = false;
      btn.querySelector('.spinner-border')?.classList.add('d-none');
    }
  });
}

