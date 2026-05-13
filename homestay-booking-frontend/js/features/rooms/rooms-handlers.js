import { state } from '../../core/state.js';
import { getVal, setVal, toast } from '../../shared/utils.js';
import { fetchRooms } from './rooms-logic.js';
import { renderPagination, renderRoomList, renderRoomResultMeta } from './rooms-render.js';

export async function loadRooms() {
  const result = await fetchRooms();
  renderRoomList(result.rooms);
  renderPagination(result.total, result.page);
  renderRoomResultMeta(result.total);
}

export function applyFilters() {
  const types = ['single', 'double', 'family'].filter((t) => document.getElementById(`f-${t}`)?.checked);
  const amenities = ['wifi', 'ac', 'parking', 'pool'].filter((a) => document.getElementById(`f-${a}`)?.checked);
  state.filters = { ...state.filters };
  if (types.length) state.filters.types = types.join(',');
  if (amenities.length) state.filters.amenities = amenities.join(',');
  ['capacity-min', 'capacity-max', 'price-min', 'price-max'].forEach((name) => {
    const value = getVal(`f-${name}`);
    const key = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (value) state.filters[key] = value;
  });
  state.currentPage = 1;
  loadRooms();
}

export function resetFilters() {
  ['f-single', 'f-double', 'f-family', 'f-wifi', 'f-ac', 'f-parking', 'f-pool'].forEach((id) => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['f-capacity-min', 'f-capacity-max', 'f-price-min', 'f-price-max'].forEach((id) => setVal(id, ''));
  state.filters = {};
  state.currentPage = 1;
  loadRooms();
}

export function handleSort(value) {
  state.filters = { ...state.filters, sort: value };
  state.currentPage = 1;
  loadRooms();
}

export function changePage(page) {
  state.currentPage = Math.max(1, Number(page) || 1);
  loadRooms();
}

export function bindRoomHandlers() {
  document.querySelectorAll('.filter-sidebar input').forEach((el) => el.addEventListener('change', applyFilters));
  document.querySelector('.filter-sidebar .btn-brand-outline')?.addEventListener('click', resetFilters);
  document.getElementById('sort-select')?.addEventListener('change', (e) => handleSort(e.target.value));
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.room-card[data-room-id]');
    if (card && !e.target.closest('button')) location.href = `room-detail.html?id=${encodeURIComponent(card.dataset.roomId)}`;
    const page = e.target.closest('[data-page]');
    if (page) changePage(page.dataset.page);
    if (e.target.closest('#btn-empty-reset')) resetFilters();
    const fav = e.target.closest('[data-favorite-room]');
    if (fav) { e.preventDefault(); fav.classList.toggle('active'); toast('Đã cập nhật yêu thích.', 'success'); }
  });
}

