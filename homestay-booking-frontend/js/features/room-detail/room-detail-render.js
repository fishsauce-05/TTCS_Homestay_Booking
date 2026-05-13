import { fmtVND, placeholder, setText, stars } from '../../shared/utils.js';

const shortVND = (n) => {
  if (n == null || isNaN(n)) return '';
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
};

export function renderAvailabilityCalendar(days) {
  const box = document.getElementById('detail-availability');
  if (!box) return;

  if (!days || days.length === 0) {
    box.innerHTML = '<p class="text-muted small py-3 mb-0">Chưa có thông tin lịch trống.</p>';
    return;
  }

  // Group days by month
  const months = {};
  for (const d of days) {
    const key = d.date.slice(0, 7); // YYYY-MM
    if (!months[key]) months[key] = [];
    months[key].push(d);
  }

  const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const MONTH_NAMES = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

  let html = '<div class="avail-months">';

  for (const [monthKey, monthDays] of Object.entries(months)) {
    const [year, month] = monthKey.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();

    const dayMap = {};
    for (const d of monthDays) dayMap[d.date] = d;

    html += `<div class="avail-month">`;
    html += `<div class="avail-month-title">${MONTH_NAMES[month - 1]} ${year}</div>`;
    html += `<div class="avail-grid">`;
    html += DAY_LABELS.map((l) => `<div class="avail-cell avail-header">${l}</div>`).join('');
    for (let i = 0; i < firstDay; i++) html += `<div class="avail-cell avail-empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const info = dayMap[dateStr];
      const isPast = new Date(dateStr) < new Date(new Date().toDateString());
      if (!info) {
        html += `<div class="avail-cell avail-out"><span class="avail-day-num">${day}</span></div>`;
      } else {
        const cls = isPast ? 'avail-past' : info.isAvailable ? 'avail-open' : 'avail-booked';
        const priceStr = info.isAvailable && !isPast ? `<span class="avail-price">${shortVND(info.price)}</span>` : '';
        html += `<div class="avail-cell ${cls}" title="${dateStr}"><span class="avail-day-num">${day}</span>${priceStr}</div>`;
      }
    }
    html += `</div></div>`;
  }

  html += `</div>`;
  html += `<div class="avail-legend">
    <span class="avail-legend-item avail-open"><span class="avail-dot"></span>Còn trống</span>
    <span class="avail-legend-item avail-booked"><span class="avail-dot"></span>Đã đặt</span>
    <span class="avail-legend-item avail-past"><span class="avail-dot"></span>Đã qua</span>
  </div>`;

  box.innerHTML = html;
}

export function embedGoogleMap(lat, lng) {
  const iframe = document.getElementById('detail-map-iframe');
  if (iframe) iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&hl=vi`;
}

export function renderRoomDetails(room) {
  const price = room.priceFormatted ?? fmtVND(room.basePrice ?? room.nightlyRate ?? 0);
  setText('breadcrumb-room-name', room.name);
  setText('detail-room-name', room.name);
  setText('detail-room-type', room.typeLabel ?? room.roomType);
  setText('detail-room-location', room.location ?? room.homestay?.address);
  setText('detail-room-price', price);
  setText('widget-price', price);
  setText('widget-rating', room.rating ?? room.avgRating ?? '—');
  setText('widget-review-count', room.reviewCount ?? 0);
  setText('detail-capacity', `${room.capacity ?? '?'} khách`);
  setText('detail-type-txt', room.typeLabel ?? room.roomType);
  setText('detail-rating', room.rating ?? room.avgRating ?? '—');
  setText('detail-review-count', `${room.reviewCount ?? 0} nhận xét`);
  const desc = document.getElementById('detail-description');
  if (desc) { desc.textContent = room.description ?? ''; desc.classList.remove('skeleton-para'); }
  renderGallery(room.images ?? []);
  renderAmenities(room.amenities ?? []);
  renderReviews(room.reviews ?? [], room.avgRating ?? room.rating);
  if (room.lat && room.lng) embedGoogleMap(room.lat, room.lng);
  const btn = document.getElementById('btn-book-now');
  if (btn) Object.assign(btn.dataset, { roomId: room.id, roomName: room.name ?? '', roomPrice: room.basePrice ?? room.nightlyRate ?? 0, roomType: room.typeLabel ?? room.roomType ?? '', roomImg: room.images?.[0] ?? room.thumbnail ?? '' });
  document.querySelectorAll('#section-room-detail .skeleton-text-lg, #section-room-detail .skeleton-badge').forEach((el) => el.classList.remove('skeleton-text-lg', 'skeleton-badge'));
}

export function renderGallery(images) {
  const box = document.getElementById('detail-gallery');
  if (!box) return;
  const [main, ...thumbs] = images.length ? images : [placeholder(800, 420)];
  box.innerHTML = `<div class="gallery-main"><img src="${main}" alt="Ảnh chính" id="gallery-main-img" /></div><div class="gallery-thumbs mt-2 row g-2">${thumbs.slice(0, 4).map((img) => `<div class="col-3"><button class="gallery-thumb" type="button" data-gallery-img="${img}"><img src="${img}" alt="" /></button></div>`).join('')}</div>`;
}

export function renderAmenities(amenities) {
  const box = document.getElementById('detail-amenities');
  if (!box) return;
  box.innerHTML = amenities?.length ? amenities.map((a) => `<div class="amenity-item"><i class="${a.icon ?? 'bi bi-check-circle-fill'}"></i><span>${a.label ?? a.name ?? a}</span></div>`).join('') : '<p class="text-muted small">Chưa cập nhật.</p>';
}

export function renderReviews(reviews, avgRating) {
  const summary = document.getElementById('detail-reviews-summary');
  if (summary) summary.innerHTML = avgRating ? `<div class="rating-big">${Number(avgRating).toFixed(1)}</div><div><div class="text-warning mb-1">${stars(Number(avgRating))}</div><div class="text-muted small">Điểm trung bình</div></div>` : '<p class="text-muted small mb-0">Chưa có đánh giá</p>';
  const list = document.getElementById('detail-reviews-list');
  if (!list) return;
  if (!reviews?.length) { list.innerHTML = '<p class="text-muted small py-3">Chưa có nhận xét nào.</p>'; return; }
  list.innerHTML = reviews.map((r) => {
    const author = r.user?.fullName ?? r.user?.nickname ?? r.author ?? 'Ẩn danh';
    const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : (r.date ?? '');
    const replyHtml = r.ownerReply ? `<div class="mt-2 p-2 rounded" style="background:var(--color-bg-soft,#f8f5f0);border-left:3px solid var(--color-brand,#b5835a)"><div class="small fw-600 text-brand mb-1"><i class="bi bi-reply-fill me-1"></i>Phản hồi của chủ nhà</div><div class="small">${r.ownerReply}</div></div>` : '';
    return `<div class="review-card" data-review-id="${r.id}"><div class="review-avatar">${author[0]}</div><div class="flex-grow-1"><div class="d-flex justify-content-between align-items-start"><span class="review-author">${author}</span><div class="d-flex align-items-center gap-2"><span class="review-date">${date}</span><button class="btn btn-sm text-danger p-0 lh-1 d-none" data-delete-review="${r.id}" title="Xóa"><i class="bi bi-trash" style="font-size:.8rem"></i></button></div></div><div class="text-warning small mb-1">${stars(r.rating ?? 5)}</div><p class="review-text mb-0">${r.comment ?? r.content ?? ''}</p>${replyHtml}</div></div>`;
  }).join('');
}

export function showWriteReviewForm(homestayId) {
  const section = document.getElementById('detail-reviews-section');
  if (!section) return;
  if (document.getElementById('write-review-form')) return;
  const form = document.createElement('div');
  form.id = 'write-review-form';
  form.className = 'checkout-card p-3 mb-3';
  form.innerHTML = `<h6 class="fw-600 mb-3">Viết đánh giá của bạn</h6>
    <div class="mb-2"><label class="form-label small">Điểm đánh giá</label>
    <div class="d-flex gap-2" id="star-rating-input">${[1,2,3,4,5].map((n) => `<button type="button" class="btn p-0 star-btn" data-star="${n}" style="font-size:1.5rem;color:#ccc"><i class="bi bi-star-fill"></i></button>`).join('')}</div>
    <input type="hidden" id="review-rating-val" value="5" /></div>
    <div class="mb-2"><label class="form-label small">Nhận xét <span class="text-danger">*</span></label>
    <textarea id="review-comment" class="form-control form-control-brand" rows="3" placeholder="Chia sẻ trải nghiệm của bạn..."></textarea></div>
    <div class="d-flex gap-2"><button class="btn btn-brand btn-sm" id="btn-submit-review"><span class="spinner-border spinner-border-sm d-none me-1"></span>Gửi đánh giá</button><button class="btn btn-outline-secondary btn-sm" id="btn-cancel-review">Hủy</button></div>`;
  section.prepend(form);
  // Star rating interaction
  let selectedRating = 5;
  form.querySelectorAll('.star-btn').forEach((btn) => {
    btn.style.color = '#f5a623';
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.star);
      document.getElementById('review-rating-val').value = selectedRating;
      form.querySelectorAll('.star-btn').forEach((b, i) => { b.style.color = i < selectedRating ? '#f5a623' : '#ccc'; });
    });
  });
  form.querySelector('#btn-cancel-review')?.addEventListener('click', () => form.remove());
  form.querySelector('#btn-submit-review')?.addEventListener('click', async () => {
    const comment = document.getElementById('review-comment')?.value?.trim();
    if (!comment) { return; }
    const submitBtn = form.querySelector('#btn-submit-review');
    submitBtn.disabled = true;
    submitBtn.querySelector('.spinner-border')?.classList.remove('d-none');
    try {
      const { createReview } = await import('../room-detail/room-detail-logic.js');
      const { toast } = await import('../../shared/utils.js');
      await createReview(homestayId, selectedRating, comment);
      toast('Đã gửi đánh giá thành công!', 'success');
      form.remove();
      const { fetchHomestayReviews } = await import('../room-detail/room-detail-logic.js');
      const { renderReviews } = await import('../room-detail/room-detail-render.js');
      const reviews = await fetchHomestayReviews(homestayId);
      const avg = reviews.length ? reviews.reduce((s, r) => s + (r.rating ?? 5), 0) / reviews.length : 0;
      renderReviews(reviews, avg);
    } catch (e) {
      const { toast } = await import('../../shared/utils.js');
      toast(e.message, 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.spinner-border')?.classList.add('d-none');
    }
  });
}
