import { renderRoomList } from '../rooms/rooms-render.js';

export { renderRoomList as renderFeaturedRoomList };

export function renderCategoryPills(categories = []) {
  const box = document.getElementById('categories-list');
  if (!box) return;
  const cats = categories.length ? categories : [
    { icon: '🏖️', name: 'Biển', query: 'beach' },
    { icon: '🏔️', name: 'Núi', query: 'mountain' },
    { icon: '🌾', name: 'Đồng quê', query: 'countryside' },
    { icon: '🏙️', name: 'Thành phố', query: 'city' },
    { icon: '🌲', name: 'Rừng', query: 'forest' },
    { icon: '✨', name: 'Độc đáo', query: 'unique' },
  ];
  box.innerHTML = cats.map((c) => `<button type="button" class="category-card" data-category="${c.query}"><span class="category-card-icon">${c.icon}</span><span class="category-card-name">${c.name}</span></button>`).join('');
}
