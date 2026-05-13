import { PAGE_SIZE } from '../../core/config.js';
import { fmtVND, placeholder, setText } from '../../shared/utils.js';

export function buildRoomCard(r) {
  const price = r.priceFormatted ?? fmtVND(r.basePrice ?? r.nightlyRate ?? 0);
  return `<div class="col-12 col-md-6 col-xl-4"><div class="room-card" data-room-id="${r.id}"><div class="room-card-img-wrap"><img class="room-card-img" src="${r.thumbnail ?? r.images?.[0] ?? placeholder(400, 200)}" alt="${r.name ?? ''}" loading="lazy" /><span class="room-card-badge">${r.typeLabel ?? r.roomType ?? ''}</span><button class="room-card-fav" type="button" data-favorite-room="${r.id}"><i class="bi bi-heart"></i></button></div><div class="room-card-body"><div class="room-card-type">${r.type ?? r.roomType ?? ''}</div><div class="room-card-name">${r.name ?? ''}</div><div class="room-card-meta"><span><i class="bi bi-geo-alt me-1"></i>${r.location ?? r.homestay?.address ?? ''}</span><span><i class="bi bi-people me-1"></i>${r.capacity ?? '?'} khách</span></div><div class="room-card-footer"><div class="room-card-price">${price}<small>/đêm</small></div><div class="room-card-rating"><i class="bi bi-star-fill text-warning"></i> ${r.rating ?? '—'} <span class="text-muted">(${r.reviewCount ?? 0})</span></div></div></div></div></div>`;
}

export function renderRoomList(rooms, containerId = 'rooms-list') {
  const box = document.getElementById(containerId);
  if (!box) return;
  if (!rooms?.length) {
    box.innerHTML = '<div class="col-12 text-center py-5"><i class="bi bi-house-slash fs-1 text-muted d-block mb-3"></i><p class="text-muted">Không tìm thấy homestay phù hợp.</p><button class="btn btn-brand-outline mt-2" id="btn-empty-reset">Đặt lại bộ lọc</button></div>';
    return;
  }
  box.innerHTML = rooms.map(buildRoomCard).join('');
}

export function renderPagination(total, currentPage) {
  const box = document.getElementById('pagination-list');
  if (!box) return;
  const pages = Math.ceil(total / PAGE_SIZE);
  box.innerHTML = `${Array.from({ length: pages }, (_, i) => i + 1).map((p) => `<li class="page-item ${p === currentPage ? 'active' : ''}"><button class="page-link" type="button" data-page="${p}">${p}</button></li>`).join('')}`; 
}

export function renderRoomResultMeta(total) {
  setText('rooms-count', total);
}

