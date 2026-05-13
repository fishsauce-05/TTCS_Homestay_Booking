import initApp from '../../index.js';
import { adminTab, bindAdminHandlers, loadAllBookings, loadAllPayments, loadBankAccounts, loadHomestays, loadInvoices, loadOwners, loadStats } from './admin-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindAdminHandlers();
  adminTab('users');
  loadStats();

  // Refresh buttons
  document.getElementById('btn-refresh-homestays')?.addEventListener('click', loadHomestays);
  document.getElementById('btn-refresh-bookings')?.addEventListener('click', loadAllBookings);
  document.getElementById('btn-refresh-payments')?.addEventListener('click', loadAllPayments);
  document.getElementById('btn-refresh-bank')?.addEventListener('click', loadBankAccounts);
  document.getElementById('btn-refresh-invoices')?.addEventListener('click', loadInvoices);
});
