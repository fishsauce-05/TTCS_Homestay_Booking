import { apiDelete, apiGet, apiPatch, apiPost } from '../../core/api.js';
import { state } from '../../core/state.js';
import { delay, mockRoomDetail, showDetailSkeleton } from '../../shared/utils.js';

export async function fetchRoomDetail(roomId) {
  state.currentRoomId = roomId;
  showDetailSkeleton();
  try { return await apiGet(`/rooms/${roomId}`); }
  catch { await delay(300); return mockRoomDetail(roomId); }
}

export async function fetchAvailabilityCalendar(roomId) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 59);
  const fmt = (d) => d.toISOString().split('T')[0];
  try {
    return await apiGet(`/pricing-schedules/room/${roomId}/calendar?startDate=${fmt(startDate)}&endDate=${fmt(endDate)}`);
  } catch {
    return [];
  }
}

export const fetchHomestayReviews = (homestayId) => apiGet(`/reviews/homestay/${homestayId}`);

export const createReview = (homestayId, rating, comment) =>
  apiPost(`/reviews/${homestayId}`, { rating, comment });

export const deleteReview = (reviewId) => apiDelete(`/reviews/${reviewId}`);

export const replyReview = (reviewId, ownerReply) =>
  apiPatch(`/reviews/${reviewId}/reply`, { ownerReply });
