import initApp from '../../index.js';
import { state } from '../../core/state.js';
import { bindRoomHandlers, loadRooms } from './rooms-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const params = new URLSearchParams(location.search);
  state.filters = Object.fromEntries(params.entries());
  bindRoomHandlers();
  loadRooms();
});
