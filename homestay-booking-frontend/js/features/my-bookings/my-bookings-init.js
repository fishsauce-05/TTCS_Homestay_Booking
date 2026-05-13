import initApp from '../../index.js';
import { bindMyBookingsHandlers, filterMyBookings } from './my-bookings-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindMyBookingsHandlers();
  filterMyBookings();
});
