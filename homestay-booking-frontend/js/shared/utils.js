export const nightsBetween = (a, b) => {
  if (!a || !b) return 0;
  const days = Math.floor((new Date(b) - new Date(a)) / 86400000);
  return days > 0 ? days : 0;
};

export const fmtVND = (n) => n != null
  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n))
  : '—';
export const fmtDate = (s) => s ? new Date(s).toLocaleDateString('vi-VN') : '—';
export const stars = (r = 0) =>
  '<i class="bi bi-star-fill"></i>'.repeat(Math.floor(r)) +
  (r % 1 >= 0.5 ? '<i class="bi bi-star-half"></i>' : '') +
  '<i class="bi bi-star"></i>'.repeat(Math.max(0, 5 - Math.ceil(r)));
export const statusLabel = (s) => ({ pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã hủy' }[s] ?? s ?? '—');
export const placeholder = (w, h) => `https://placehold.co/${w}x${h}/f0e6d9/b5835a?text=Fishsauce+Homestay`;
export const getVal = (id) => document.getElementById(id)?.value ?? '';
export const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ''; };
export const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t ?? ''; };
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function toast(msg, type = 'primary') {
  const el = document.getElementById('app-toast');
  const txt = document.getElementById('toast-message');
  if (!el || !txt || !window.bootstrap) return;
  const bg = { success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning text-dark', info: 'bg-info text-dark' }[type] ?? 'bg-dark';
  el.className = `toast align-items-center text-white border-0 ${bg}`;
  txt.textContent = msg;
  new bootstrap.Toast(el, { delay: 3500 }).show();
}

export function setBtnLoading(id, on) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = on;
  btn.querySelector('.spinner-border')?.classList.toggle('d-none', !on);
}

export function showSkeletonCards(containerId, count) {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = Array(count).fill(0).map(() => '<div class="col-12 col-md-6 col-xl-4"><div class="room-card skeleton-card"></div></div>').join('');
}

export function showDetailSkeleton() {
  setText('detail-room-name', '');
  document.getElementById('detail-room-name')?.classList.add('skeleton-text-lg');
}

export function mockRooms(n = 9) {
  const names = ['Villa Sương Mai', 'Homestay Bình Yên', 'Garden House Xanh', 'Sunrise Loft', 'Mây Trắng Retreat', 'Terra Homestay', 'La Campagne', 'Bamboo Nest', 'SeaBreeze Home'];
  const locs = ['Đà Lạt', 'Hội An', 'Phú Quốc', 'Hà Nội', 'Đà Nẵng'];
  const types = ['Phòng Đơn', 'Phòng Đôi', 'Phòng Gia Đình'];
  const prices = [450000, 650000, 850000, 1200000, 980000];
  const imgs = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop&q=60',
  ];
  return Array.from({ length: n }, (_, i) => {
    const p = prices[i % prices.length];
    return { id: `room_${i + 1}`, name: names[i % names.length], type: types[i % types.length].toUpperCase(), typeLabel: types[i % types.length], location: locs[i % locs.length], capacity: (i % 4) + 2, nightlyRate: p, basePrice: p, priceFormatted: fmtVND(p), rating: (4 + ((i * 0.1) % 1)).toFixed(1), reviewCount: 10 + i * 3, thumbnail: imgs[i % imgs.length] };
  });
}

export function mockRoomDetail(id) {
  return {
    id, name: 'Villa Sương Mai', typeLabel: 'Phòng Gia Đình', type: 'FAMILY', location: 'Đà Lạt, Lâm Đồng', capacity: 6, nightlyRate: 1200000, priceFormatted: fmtVND(1200000), rating: 4.8, avgRating: 4.8, reviewCount: 42,
    description: 'Villa Sương Mai tọa lạc trên đồi thông yên tĩnh, tầm nhìn ra thung lũng. Phù hợp gia đình hoặc nhóm bạn muốn tận hưởng không gian riêng tư.',
    amenities: [{ id: 'wifi', icon: 'bi bi-wifi', label: 'WiFi tốc độ cao' }, { id: 'ac', icon: 'bi bi-thermometer', label: 'Điều hòa' }, { id: 'kitchen', icon: 'bi bi-egg-fried', label: 'Bếp nấu ăn' }, { id: 'tv', icon: 'bi bi-tv', label: 'Smart TV' }, { id: 'parking', icon: 'bi bi-p-circle', label: 'Bãi đỗ xe' }, { id: 'pool', icon: 'bi bi-water', label: 'Hồ bơi' }],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop&q=60'],
    reviews: [{ id: 'r1', author: 'Trần Minh Anh', date: '12/05/2025', rating: 5, content: 'Không gian tuyệt vời, chủ nhà rất thân thiện!' }, { id: 'r2', author: 'Nguyễn Bích Ngọc', date: '03/04/2025', rating: 4, content: 'Phòng sạch, view đẹp. Sẽ quay lại lần sau.' }],
    lat: 11.9404, lng: 108.4583, zaloLink: 'https://zalo.me/0900000000',
  };
}
