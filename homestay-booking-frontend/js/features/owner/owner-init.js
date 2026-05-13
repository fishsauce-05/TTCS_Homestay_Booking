import initApp from '../../index.js';
import { bindOwnerHandlers, getRoomImages, loadBookings, loadHomestays, loadPricing, loadRooms, ownerTab, setRoomImages } from './owner-handlers.js';
import { getVal, toast } from '../../shared/utils.js';
import * as logic from './owner-logic.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindOwnerHandlers();
  ownerTab('homestays');

  // Refresh booking button
  document.getElementById('btn-refresh-owner-bookings')?.addEventListener('click', loadBookings);

  // Homestay form toggle
  document.getElementById('btn-show-homestay-form')?.addEventListener('click', () => {
    document.getElementById('homestay-form-wrap')?.classList.remove('d-none');
    document.getElementById('hs-editing-id').value = '';
    document.getElementById('homestay-form-title').textContent = 'Thêm Homestay mới';
  });
  document.getElementById('btn-cancel-homestay')?.addEventListener('click', () => document.getElementById('homestay-form-wrap')?.classList.add('d-none'));
  document.getElementById('btn-save-homestay')?.addEventListener('click', async () => {
    const id = getVal('hs-editing-id');
    const body = { title: getVal('hs-title'), address: getVal('hs-address'), description: getVal('hs-description'), latitude: Number(getVal('hs-lat')) || undefined, longitude: Number(getVal('hs-lng')) || undefined };
    try { await logic.saveHomestayApi(body, id || null); document.getElementById('homestay-form-wrap')?.classList.add('d-none'); toast('Đã lưu homestay.', 'success'); await loadHomestays(); }
    catch (e) { toast(e.message, 'danger'); }
  });

  // Room form toggle
  document.getElementById('btn-show-room-form')?.addEventListener('click', () => {
    setRoomImages([]);
    document.getElementById('room-form-wrap')?.classList.remove('d-none');
    document.getElementById('r-editing-id').value = '';
    document.getElementById('room-form-title').textContent = 'Thêm phòng mới';
  });
  document.getElementById('btn-cancel-room')?.addEventListener('click', () => {
    setRoomImages([]);
    document.getElementById('room-form-wrap')?.classList.add('d-none');
  });
  document.getElementById('btn-save-room')?.addEventListener('click', async () => {
    const id = getVal('r-editing-id');
    const images = getRoomImages();
    const body = { homestayId: getVal('r-homestay-id'), name: getVal('r-name'), roomType: getVal('r-type'), capacity: Number(getVal('r-capacity')), basePrice: Number(getVal('r-base-price')), status: getVal('r-status'), description: getVal('r-description') || undefined, images: images.length ? images : [] };
    try { await logic.saveRoomApi(body, id || null); setRoomImages([]); document.getElementById('room-form-wrap')?.classList.add('d-none'); toast('Đã lưu phòng.', 'success'); await loadRooms(); }
    catch (e) { toast(e.message, 'danger'); }
  });

  // Pricing form toggle
  document.getElementById('btn-show-pricing-form')?.addEventListener('click', () => {
    document.getElementById('pricing-form-wrap')?.classList.remove('d-none');
    document.getElementById('ps-editing-id').value = '';
    document.getElementById('pricing-form-title').textContent = 'Thêm lịch giá';
  });
  document.getElementById('btn-cancel-pricing')?.addEventListener('click', () => document.getElementById('pricing-form-wrap')?.classList.add('d-none'));
  document.getElementById('btn-save-pricing')?.addEventListener('click', async () => {
    const id = getVal('ps-editing-id');
    const body = { roomId: getVal('ps-room-id'), startDate: getVal('ps-start-date'), endDate: getVal('ps-end-date'), pricePerNight: Number(getVal('ps-price')) };
    try { await logic.savePricingApi(body, id || null); document.getElementById('pricing-form-wrap')?.classList.add('d-none'); toast('Đã lưu lịch giá.', 'success'); await loadPricing(); }
    catch (e) { toast(e.message, 'danger'); }
  });
});
