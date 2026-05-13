import { getVal } from '../../shared/utils.js';

export function handleSearch() {
  const params = new URLSearchParams();
  [['location', 'search-location'], ['checkin', 'search-checkin'], ['checkout', 'search-checkout'], ['guests', 'search-guests']].forEach(([key, id]) => {
    const value = getVal(id);
    if (value) params.set(key, value);
  });
  location.href = `pages/rooms.html?${params}`;
}

export function searchByCategory(category) {
  location.href = `pages/rooms.html?category=${encodeURIComponent(category)}`;
}

export function bindHomeHandlers() {
  document.getElementById('btn-search')?.addEventListener('click', handleSearch);
  document.querySelector('.btn-text-link')?.setAttribute('href', 'pages/rooms.html');
  document.addEventListener('click', (e) => {
    const cat = e.target.closest('[data-category]');
    if (cat) searchByCategory(cat.dataset.category);
    const card = e.target.closest('.room-card[data-room-id]');
    if (card && !e.target.closest('button')) location.href = `pages/room-detail.html?id=${encodeURIComponent(card.dataset.roomId)}`;
  });
}
