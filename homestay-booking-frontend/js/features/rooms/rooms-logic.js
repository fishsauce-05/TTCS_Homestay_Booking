import { apiGet } from '../../core/api.js';
import { PAGE_SIZE } from '../../core/config.js';
import { state } from '../../core/state.js';
import { delay, mockRooms, showSkeletonCards } from '../../shared/utils.js';

export async function fetchRooms(extraParams = {}) {
  const params = new URLSearchParams({ ...state.filters, ...extraParams, page: state.currentPage, limit: PAGE_SIZE });
  showSkeletonCards('rooms-list', PAGE_SIZE);
  try {
    const body = await apiGet(`/rooms?${params}`);
    const rooms = body.data ?? body;
    return { rooms, total: body.total ?? rooms.length, page: body.page ?? state.currentPage, limit: body.limit ?? PAGE_SIZE };
  } catch {
    await delay(300);
    return { rooms: mockRooms(PAGE_SIZE), total: 24, page: state.currentPage };
  }
}
