import initApp from '../../index.js';
import { restoreCheckoutFromURL } from './booking-logic.js';
import { populateCheckout } from './booking-render.js';
import { bindBookingHandlers } from './booking-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindBookingHandlers();
  restoreCheckoutFromURL();
  populateCheckout();
});
