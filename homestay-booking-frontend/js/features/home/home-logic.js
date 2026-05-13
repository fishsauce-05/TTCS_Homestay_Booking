import { apiGet } from '../../core/api.js';
import { delay, mockRooms, showSkeletonCards } from '../../shared/utils.js';

export async function fetchFeaturedRooms() {
  showSkeletonCards('featured-rooms-list', 3);
  try {
    const body = await apiGet('/rooms/featured?limit=6');
    return { rooms: body.data ?? body, categories: body.categories ?? [] };
  } catch {
    await delay(300);
    return { rooms: mockRooms(3), categories: [] };
  }
}
