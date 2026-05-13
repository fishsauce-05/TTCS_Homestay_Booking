import { apiDelete, apiGet, apiPatch, apiPost } from '../../core/api.js';

// Homestays & Rooms
export const fetchOwnerHomestays = () => apiGet('/homestays/my-homestays');
export const fetchOwnerRooms = (homestayId) => apiGet(`/rooms/homestay/${homestayId}`);
export const fetchOwnerPricing = (roomId) => apiGet(`/pricing-schedules/room/${roomId}`);
export const saveHomestayApi = (body, id) => id ? apiPatch(`/homestays/${id}`, body) : apiPost('/homestays', body);
export const deleteHomestayApi = (id) => apiDelete(`/homestays/${id}`);
export const saveRoomApi = (body, id) => id ? apiPatch(`/rooms/${id}`, body) : apiPost('/rooms', body);
export const deleteRoomApi = (id) => apiDelete(`/rooms/${id}`);
export const savePricingApi = (body, id) => id ? apiPatch(`/pricing-schedules/${id}`, body) : apiPost('/pricing-schedules', body);
export const deletePricingApi = (id) => apiDelete(`/pricing-schedules/${id}`);

// Bookings
export const fetchOwnerBookings = (homestayId) => apiGet(`/bookings/homestay/${homestayId}`);
export const confirmOwnerBooking = (id) => apiPatch(`/bookings/${id}/confirm`, {});
export const completeOwnerBooking = (id) => apiPatch(`/bookings/${id}/complete`, {});

// Payments
export const fetchOwnerPayments = () => apiGet('/payments/owner/me');
export const approvePayment = (id) => apiPatch(`/payments/${id}/approve`, {});
export const rejectPayment = (id, reason) => apiPatch(`/payments/${id}/reject`, { reason });

// Stats
export const fetchOwnerStats = (startDate, endDate) => apiGet(`/stats/revenue/homestay?startDate=${startDate}&endDate=${endDate}`);
export const fetchOwnerSummary = () => apiGet('/stats/owner-summary');
export const fetchRoomRevenue = (homestayId, startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const qs = params.toString();
  return apiGet(`/stats/revenue/homestay/${homestayId}/rooms${qs ? '?' + qs : ''}`);
};
export const fetchRoomBookings = (roomId, startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const qs = params.toString();
  return apiGet(`/stats/revenue/room/${roomId}/bookings${qs ? '?' + qs : ''}`);
};

// Reviews
export const fetchOwnerReviews = (homestayId) => apiGet(`/reviews/homestay/${homestayId}`);
export const replyToReview = (reviewId, ownerReply) => apiPatch(`/reviews/${reviewId}/reply`, { ownerReply });
export const deleteReviewApi = (reviewId) => apiDelete(`/reviews/${reviewId}`);

// Bank account
export const fetchMyBankAccount = () => apiGet('/bank-accounts/me');
export const saveBankAccount = (body, exists) => exists ? apiPatch('/bank-accounts/me', body) : apiPost('/bank-accounts', body);
export const deleteMyBankAccount = () => apiDelete('/bank-accounts/me');
