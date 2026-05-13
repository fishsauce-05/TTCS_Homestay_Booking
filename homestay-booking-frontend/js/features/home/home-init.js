import initApp from '../../index.js';
import { fetchFeaturedRooms } from './home-logic.js';
import { renderCategoryPills, renderFeaturedRoomList } from './home-render.js';
import { bindHomeHandlers } from './home-handlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  initApp();
  bindHomeHandlers();
  const data = await fetchFeaturedRooms();
  renderFeaturedRoomList(data.rooms, 'featured-rooms-list');
  renderCategoryPills(data.categories);
});
