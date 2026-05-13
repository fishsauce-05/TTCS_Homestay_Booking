import { getCurrentUser } from '../../core/api.js';
import initApp from '../../index.js';
import { fetchAvailabilityCalendar, fetchRoomDetail } from './room-detail-logic.js';
import { bindRoomDetailHandlers, loadAndRenderReviews } from './room-detail-handlers.js';
import { renderAvailabilityCalendar, renderRoomDetails, showWriteReviewForm } from './room-detail-render.js';

document.addEventListener('DOMContentLoaded', async () => {
  initApp();
  bindRoomDetailHandlers();
  const id = new URLSearchParams(location.search).get('id') || 'room_1';
  const [room, calendarDays] = await Promise.all([
    fetchRoomDetail(id),
    fetchAvailabilityCalendar(id),
  ]);
  renderRoomDetails(room);
  renderAvailabilityCalendar(calendarDays);

  // Set homestayId on reviews section for delete handler
  const homestayId = room?.homestayId ?? room?.homestay?.id;
  const reviewsSection = document.getElementById('detail-reviews-section');
  if (reviewsSection && homestayId) reviewsSection.dataset.homestayId = homestayId;

  // Load reviews from API if homestay ID available
  if (homestayId) {
    await loadAndRenderReviews(homestayId);
    // Show "Write review" button for logged-in users
    const me = getCurrentUser();
    if (me) {
      const writeBtn = document.getElementById('btn-write-review');
      if (writeBtn) {
        writeBtn.classList.remove('d-none');
        writeBtn.addEventListener('click', () => showWriteReviewForm(homestayId));
      }
    }
  }
});
