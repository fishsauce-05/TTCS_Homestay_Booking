import { apiGet, apiPatch, apiPost } from '../../core/api.js';

export async function fetchMyBookings(status = 'all') {
  const data = await apiGet('/bookings/my');
  return status === 'all' ? data : (data ?? []).filter((b) => b.status === status);
}

export function cancelMyBooking(id, reason = '') {
  return apiPatch(`/bookings/${id}/cancel`, { cancellationReason: reason });
}

export const fetchMyInvoices = () => apiGet('/invoices/my');

export const fetchInvoiceByBooking = (bookingId) => apiGet(`/invoices/booking/${bookingId}`);

export const createReview = (homestayId, rating, comment) =>
  apiPost(`/reviews/${homestayId}`, { rating, comment });
