import { getCurrentUser } from '../../core/api.js';
import { getVal, nightsBetween, setText, toast, fmtVND } from '../../shared/utils.js';
import { deleteReview, fetchHomestayReviews } from './room-detail-logic.js';
import { renderReviews, showWriteReviewForm } from './room-detail-render.js';

export function goToBooking() {
  const btn = document.getElementById('btn-book-now');
  const checkin = getVal('widget-checkin');
  const checkout = getVal('widget-checkout');
  const nights = nightsBetween(checkin, checkout);
  if (nights <= 0) { toast('Vui lòng chọn ngày Check-in và Check-out hợp lệ.', 'warning'); return; }
  const params = new URLSearchParams({ roomId: btn?.dataset.roomId ?? '', roomName: btn?.dataset.roomName ?? '', roomType: btn?.dataset.roomType ?? '', roomImg: btn?.dataset.roomImg ?? '', price: btn?.dataset.roomPrice ?? '0', checkin, checkout, guests: getVal('widget-guests') || '1' });
  location.href = `checkout.html?${params}`;
}

export function calcWidgetNights() {
  const nights = nightsBetween(getVal('widget-checkin'), getVal('widget-checkout'));
  const err = document.getElementById('widget-date-error');
  const row = document.getElementById('widget-nights-row');
  if (nights <= 0) { err?.classList.remove('d-none'); row?.classList.add('d-none'); return; }
  err?.classList.add('d-none'); row?.classList.remove('d-none');
  const rate = Number(document.getElementById('btn-book-now')?.dataset.roomPrice) || 0;
  setText('widget-nights-label', `${nights} đêm × ${fmtVND(rate)}`);
  setText('widget-nights-subtotal', fmtVND(nights * rate));
}

export async function loadAndRenderReviews(homestayId) {
  if (!homestayId) return;
  try {
    const reviews = await fetchHomestayReviews(homestayId);
    const avg = reviews?.length ? reviews.reduce((s, r) => s + (r.rating ?? 5), 0) / reviews.length : 0;
    renderReviews(reviews, avg);
    // Show delete buttons for own reviews
    const me = getCurrentUser();
    if (me) {
      (reviews ?? []).forEach((r) => {
        if (r.userId === me.id || r.user?.id === me.id || me.role === 'admin') {
          document.querySelector(`[data-delete-review="${r.id}"]`)?.classList.remove('d-none');
        }
      });
    }
  } catch { /* keep mock reviews */ }
}

export function bindRoomDetailHandlers() {
  document.getElementById('btn-book-now')?.addEventListener('click', goToBooking);
  ['widget-checkin', 'widget-checkout'].forEach((id) => document.getElementById(id)?.addEventListener('change', calcWidgetNights));
  document.addEventListener('click', async (e) => {
    const thumb = e.target.closest('[data-gallery-img]');
    if (thumb) { document.getElementById('gallery-main-img').src = thumb.dataset.galleryImg; return; }

    const delReview = e.target.closest('[data-delete-review]');
    if (delReview) {
      if (!confirm('Xóa đánh giá này?')) return;
      try {
        await deleteReview(delReview.dataset.deleteReview);
        const homestayId = document.getElementById('detail-reviews-section')?.dataset.homestayId;
        await loadAndRenderReviews(homestayId);
        toast('Đã xóa đánh giá.', 'success');
      } catch (err) { toast(err.message, 'danger'); }
    }
  });
}
