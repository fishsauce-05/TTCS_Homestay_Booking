import initApp from '../../index.js';
import { bindProfileHandlers, loadProfile } from './profile-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindProfileHandlers();
  loadProfile();
});
