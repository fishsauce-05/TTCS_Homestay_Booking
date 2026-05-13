import { fmtVND } from './utils.js';

// ─── Shared assets ───────────────────────────────────────────────────────────
const IMGS = {
  rooms: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
  ],
  avatars: [
    'https://i.pravatar.cc/80?img=11',
    'https://i.pravatar.cc/80?img=23',
    'https://i.pravatar.cc/80?img=47',
    'https://i.pravatar.cc/80?img=56',
  ],
};

const AMENITIES_POOL = [
  { id: 'wifi',     icon: 'bi bi-wifi',           label: 'WiFi tốc độ cao' },
  { id: 'ac',       icon: 'bi bi-thermometer',     label: 'Điều hòa' },
  { id: 'kitchen',  icon: 'bi bi-egg-fried',        label: 'Bếp nấu ăn' },
  { id: 'tv',       icon: 'bi bi-tv',               label: 'Smart TV' },
  { id: 'parking',  icon: 'bi bi-p-circle',         label: 'Bãi đỗ xe' },
  { id: 'pool',     icon: 'bi bi-water',            label: 'Hồ bơi' },
  { id: 'washer',   icon: 'bi bi-life-preserver',   label: 'Máy giặt' },
  { id: 'balcony',  icon: 'bi bi-sunset',           label: 'Ban công view đẹp' },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'user_admin', fullName: 'Admin Hệ Thống', nickname: 'admin', email: 'admin@homestay.com', phone: '0900000001', role: 'admin',  isEmailVerified: true,  isLocked: false, avatar: IMGS.avatars[0], address: 'Hà Nội', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'user_owner', fullName: 'Nguyễn Văn Chủ',  nickname: 'owner1', email: 'owner@homestay.com', phone: '0900000002', role: 'owner',  isEmailVerified: true,  isLocked: false, avatar: IMGS.avatars[1], address: 'Đà Lạt', createdAt: '2024-02-15T00:00:00Z' },
  { id: 'user_guest', fullName: 'Trần Thị Khách',  nickname: 'guest1', email: 'guest@homestay.com', phone: '0900000003', role: 'guest',  isEmailVerified: true,  isLocked: false, avatar: IMGS.avatars[2], address: 'TP.HCM', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'user_g2',    fullName: 'Lê Minh Tuấn',    nickname: 'lmtuan', email: 'tuan@example.com',   phone: '0900000004', role: 'guest',  isEmailVerified: false, isLocked: false, avatar: IMGS.avatars[3], address: 'Hà Nội', createdAt: '2024-04-01T00:00:00Z' },
  { id: 'user_own2',  fullName: 'Phạm Thị Hoa',    nickname: 'pthoa',  email: 'hoa@example.com',    phone: '0900000005', role: 'owner',  isEmailVerified: true,  isLocked: false, avatar: IMGS.avatars[0], address: 'Hội An', createdAt: '2024-05-20T00:00:00Z' },
];

// ─── Homestays ───────────────────────────────────────────────────────────────
export const MOCK_HOMESTAYS = [
  { id: 'hs_1', userId: 'user_owner', title: 'Villa Sương Mai', description: 'Villa trên đồi thông yên tĩnh với tầm nhìn toàn cảnh thung lũng Đà Lạt. Không gian rộng rãi, phù hợp gia đình hoặc nhóm bạn.', address: '123 Nguyễn Công Trứ, Đà Lạt, Lâm Đồng', latitude: 11.9404, longitude: 108.4583, status: 'APPROVED', rejectionReason: null, createdAt: '2024-02-20T00:00:00Z' },
  { id: 'hs_2', userId: 'user_owner', title: 'Homestay Bình Yên',  description: 'Không gian xanh mát giữa lòng Đà Lạt, gần chợ đêm. Thích hợp cặp đôi và gia đình nhỏ.', address: '45 Phan Đình Phùng, Đà Lạt, Lâm Đồng', latitude: 11.9412, longitude: 108.4421, status: 'APPROVED', rejectionReason: null, createdAt: '2024-03-05T00:00:00Z' },
  { id: 'hs_3', userId: 'user_own2',  title: 'Garden House Xanh',  description: 'Nhà vườn truyền thống ở Hội An, bao quanh bởi cây xanh. Cách phố cổ 2km.', address: '78 Nguyễn Thái Học, Hội An, Quảng Nam', latitude: 15.8794, longitude: 108.3350, status: 'APPROVED', rejectionReason: null, createdAt: '2024-05-25T00:00:00Z' },
];

// ─── Rooms ───────────────────────────────────────────────────────────────────
const makeRoom = (id, homestayId, name, type, typeLabel, price, capacity, imgIdx) => ({
  id,
  homestayId,
  homestay: MOCK_HOMESTAYS.find((h) => h.id === homestayId),
  name,
  roomType: type,
  typeLabel,
  basePrice: price,
  nightlyRate: price,
  priceFormatted: fmtVND(price),
  capacity,
  status: 'ACTIVE',
  description: `${name} — không gian thoáng mát, đầy đủ tiện nghi, phù hợp ${capacity} khách.`,
  thumbnail: IMGS.rooms[imgIdx % IMGS.rooms.length],
  images: [IMGS.rooms[imgIdx % IMGS.rooms.length], IMGS.rooms[(imgIdx + 1) % IMGS.rooms.length], IMGS.rooms[(imgIdx + 2) % IMGS.rooms.length]],
  amenities: AMENITIES_POOL.slice(0, 4 + (imgIdx % 4)),
  avgRating: (4.2 + (imgIdx * 0.15) % 0.8).toFixed(1),
  rating:    (4.2 + (imgIdx * 0.15) % 0.8).toFixed(1),
  reviewCount: 8 + imgIdx * 4,
  lat: 11.9404 + imgIdx * 0.001,
  lng: 108.4583 + imgIdx * 0.001,
  reviews: [
    { id: `rv_${id}_1`, author: 'Trần Minh Anh', date: '12/05/2025', rating: 5, content: 'Phòng sạch sẽ, chủ nhà rất thân thiện và nhiệt tình!' },
    { id: `rv_${id}_2`, author: 'Nguyễn Bích Ngọc', date: '03/04/2025', rating: 4, content: 'View đẹp, yên tĩnh. Sẽ quay lại lần sau.' },
    { id: `rv_${id}_3`, author: 'Lê Văn Hùng', date: '20/03/2025', rating: 5, content: 'Tuyệt vời! Xứng đáng từng đồng.' },
  ],
});

export const MOCK_ROOMS = [
  makeRoom('room_1', 'hs_1', 'Villa Sương Mai — Phòng Gia Đình', 'FAMILY',  'Phòng Gia Đình', 1200000, 6, 0),
  makeRoom('room_2', 'hs_1', 'Villa Sương Mai — Phòng Đôi',      'DOUBLE',  'Phòng Đôi',      850000,  2, 1),
  makeRoom('room_3', 'hs_2', 'Bình Yên — Phòng Đơn',             'SINGLE',  'Phòng Đơn',      450000,  1, 2),
  makeRoom('room_4', 'hs_2', 'Bình Yên — Phòng Đôi',             'DOUBLE',  'Phòng Đôi',      650000,  2, 3),
  makeRoom('room_5', 'hs_3', 'Garden House — Phòng Gia Đình',    'FAMILY',  'Phòng Gia Đình', 980000,  4, 4),
  makeRoom('room_6', 'hs_3', 'Garden House — Phòng Đôi',         'DOUBLE',  'Phòng Đôi',      780000,  2, 5),
  makeRoom('room_7', 'hs_1', 'Villa Sương Mai — Phòng VIP',       'SUITE',   'Phòng Suite',   1800000, 4, 0),
  makeRoom('room_8', 'hs_2', 'Bình Yên — Phòng Gia Đình',        'FAMILY',  'Phòng Gia Đình', 920000,  5, 2),
  makeRoom('room_9', 'hs_3', 'Garden House — Phòng Đơn',          'SINGLE',  'Phòng Đơn',      380000,  1, 4),
];

// ─── Pricing schedules ───────────────────────────────────────────────────────
const today = new Date();
const fmt   = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const MOCK_PRICING_SCHEDULES = MOCK_ROOMS.flatMap((r, i) => [
  { id: `ps_${r.id}_1`, roomId: r.id, startDate: fmt(addDays(today, 5)),  endDate: fmt(addDays(today, 15)), pricePerNight: r.basePrice * 1.2, createdAt: '2024-01-01T00:00:00Z' },
  { id: `ps_${r.id}_2`, roomId: r.id, startDate: fmt(addDays(today, 20)), endDate: fmt(addDays(today, 30)), pricePerNight: r.basePrice * 0.9, createdAt: '2024-01-01T00:00:00Z' },
]);

export function mockCalendar(roomId) {
  const room = MOCK_ROOMS.find((r) => r.id === roomId) ?? MOCK_ROOMS[0];
  const schedules = MOCK_PRICING_SCHEDULES.filter((p) => p.roomId === room.id);
  const result = [];
  for (let i = 0; i < 60; i++) {
    const d = addDays(today, i);
    const ds = fmt(d);
    const sched = schedules.find((s) => s.startDate <= ds && s.endDate >= ds);
    // simulate some booked days
    const isBooked = [3, 4, 12, 13, 25, 26].includes(i);
    result.push({ date: ds, price: Number(sched?.pricePerNight ?? room.basePrice), isAvailable: !isBooked, pricingScheduleId: sched?.id ?? null });
  }
  return result;
}

// ─── Bookings ────────────────────────────────────────────────────────────────
export const MOCK_BOOKINGS = [
  { id: 'bk_1', userId: 'user_guest', roomId: 'room_1', room: MOCK_ROOMS[0], checkInDate: fmt(addDays(today, 10)), checkOutDate: fmt(addDays(today, 13)), numberOfNights: 3, numberOfGuests: 2, pricePerNight: 1200000, roomPrice: 3600000, discountAmount: 0, totalPrice: 3600000, penaltyAmount: null, refundAmount: null, status: 'CONFIRMED',  cancellationReason: null, createdAt: fmt(addDays(today, -5)) },
  { id: 'bk_2', userId: 'user_guest', roomId: 'room_3', room: MOCK_ROOMS[2], checkInDate: fmt(addDays(today, -10)), checkOutDate: fmt(addDays(today, -8)), numberOfNights: 2, numberOfGuests: 1, pricePerNight: 450000,  roomPrice: 900000,  discountAmount: 0, totalPrice: 900000,  penaltyAmount: null, refundAmount: null, status: 'COMPLETED',  cancellationReason: null, createdAt: fmt(addDays(today, -15)) },
  { id: 'bk_3', userId: 'user_guest', roomId: 'room_5', room: MOCK_ROOMS[4], checkInDate: fmt(addDays(today, 20)), checkOutDate: fmt(addDays(today, 23)), numberOfNights: 3, numberOfGuests: 3, pricePerNight: 980000,  roomPrice: 2940000, discountAmount: 200000, totalPrice: 2740000, penaltyAmount: null, refundAmount: null, status: 'PENDING',    cancellationReason: null, createdAt: fmt(addDays(today, -2)) },
  { id: 'bk_4', userId: 'user_g2',    roomId: 'room_2', room: MOCK_ROOMS[1], checkInDate: fmt(addDays(today, -3)), checkOutDate: fmt(addDays(today, -1)), numberOfNights: 2, numberOfGuests: 2, pricePerNight: 850000,  roomPrice: 1700000, discountAmount: 0, totalPrice: 1700000, penaltyAmount: null, refundAmount: null, status: 'CANCELLED',  cancellationReason: 'Thay đổi kế hoạch', createdAt: fmt(addDays(today, -10)) },
  { id: 'bk_5', userId: 'user_guest', roomId: 'room_7', room: MOCK_ROOMS[6], checkInDate: fmt(addDays(today, 35)), checkOutDate: fmt(addDays(today, 38)), numberOfNights: 3, numberOfGuests: 4, pricePerNight: 1800000, roomPrice: 5400000, discountAmount: 0, totalPrice: 5400000, penaltyAmount: null, refundAmount: null, status: 'PENDING',    cancellationReason: null, createdAt: fmt(addDays(today, -1)) },
];

// ─── Vouchers ────────────────────────────────────────────────────────────────
export const MOCK_VOUCHERS = [
  { id: 'vc_1', code: 'WELCOME20', discountType: 'PERCENT', discountValue: 20, minOrderValue: 500000,  maxDiscount: 200000, usageLimit: 100, usedCount: 34, isActive: true,  expiresAt: fmt(addDays(today, 60)),  createdAt: '2024-01-01T00:00:00Z' },
  { id: 'vc_2', code: 'SUMMER50K', discountType: 'FIXED',   discountValue: 50000,  minOrderValue: 300000,  maxDiscount: null,   usageLimit: 50,  usedCount: 50, isActive: false, expiresAt: fmt(addDays(today, -5)),  createdAt: '2024-03-01T00:00:00Z' },
  { id: 'vc_3', code: 'VIP15',     discountType: 'PERCENT', discountValue: 15, minOrderValue: 1000000, maxDiscount: 300000, usageLimit: 20,  usedCount: 7,  isActive: true,  expiresAt: fmt(addDays(today, 90)),  createdAt: '2024-04-01T00:00:00Z' },
];

// ─── Stats ───────────────────────────────────────────────────────────────────
export const MOCK_STATS_SUMMARY = {
  totalUsers: 128,
  totalOwners: 14,
  totalHomestays: 32,
  totalRooms: 87,
  totalBookings: 456,
  totalRevenue: 187500000,
  pendingBookings: 23,
  activeRooms: 74,
};

export function mockRevenueStats() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i * 5);
    result.push({ date: fmt(d), revenue: Math.floor(Math.random() * 8000000) + 2000000, bookings: Math.floor(Math.random() * 12) + 3 });
  }
  return result;
}

// ─── Payments ────────────────────────────────────────────────────────────────
export const MOCK_PAYMENT = (bookingId) => ({
  id: `pay_${bookingId}`,
  bookingId,
  amount: 3600000,
  method: 'BANK_TRANSFER',
  status: 'PENDING',
  paymentUrl: '#mock-payment',
  createdAt: new Date().toISOString(),
});

// ─── Mock auth tokens ─────────────────────────────────────────────────────────
export const MOCK_AUTH = {
  'admin@homestay.com':  { user: MOCK_USERS[0], token: 'mock_token_admin' },
  'owner@homestay.com':  { user: MOCK_USERS[1], token: 'mock_token_owner' },
  'guest@homestay.com':  { user: MOCK_USERS[2], token: 'mock_token_guest' },
  'tuan@example.com':    { user: MOCK_USERS[3], token: 'mock_token_g2' },
  'hoa@example.com':     { user: MOCK_USERS[4], token: 'mock_token_own2' },
};

// ─── Central mock router ─────────────────────────────────────────────────────
export function mockApiResponse(method, path, body) {
  const p = path.replace(/\?.*$/, ''); // strip query string
  const seg = p.split('/').filter(Boolean); // ['rooms', 'featured'] etc.

  // AUTH
  if (method === 'POST' && p === '/auth/login') {
    const match = MOCK_AUTH[body?.email];
    if (!match) throw new Error('Email hoặc mật khẩu không đúng');
    return { accessToken: match.token, user: match.user };
  }
  if (method === 'POST' && p === '/auth/register') {
    const newUser = { id: `user_${Date.now()}`, fullName: body?.fullName ?? 'New User', nickname: body?.nickname ?? 'newuser', email: body?.email, phone: body?.phone ?? '', role: 'guest', isEmailVerified: false, isLocked: false, avatar: null, address: null, createdAt: new Date().toISOString() };
    return { accessToken: 'mock_token_new', user: newUser };
  }

  // ROOMS
  if (method === 'GET' && p === '/rooms/featured') return MOCK_ROOMS.slice(0, 6);
  if (method === 'GET' && p === '/rooms' && !seg.includes('homestay')) {
    const qs = new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');
    const page = parseInt(qs.get('page') ?? '1', 10);
    const limit = parseInt(qs.get('limit') ?? '9', 10);
    const keyword = (qs.get('keyword') ?? '').toLowerCase();
    let rooms = keyword ? MOCK_ROOMS.filter((r) => r.name.toLowerCase().includes(keyword) || r.homestay?.address?.toLowerCase().includes(keyword)) : MOCK_ROOMS;
    const start = (page - 1) * limit;
    return { data: rooms.slice(start, start + limit), total: rooms.length, page, limit };
  }
  if (method === 'GET' && seg[0] === 'rooms' && seg[1] === 'homestay') {
    return MOCK_ROOMS.filter((r) => r.homestayId === seg[2]);
  }
  if (method === 'GET' && seg[0] === 'rooms' && seg.length === 2) {
    return MOCK_ROOMS.find((r) => r.id === seg[1]) ?? MOCK_ROOMS[0];
  }
  if (method === 'POST' && p === '/rooms') {
    return { id: `room_new_${Date.now()}`, ...body, status: 'ACTIVE', createdAt: new Date().toISOString() };
  }
  if ((method === 'PATCH' || method === 'DELETE') && seg[0] === 'rooms') {
    return method === 'DELETE' ? { message: 'Xóa phòng thành công' } : { id: seg[1], ...body };
  }

  // HOMESTAYS
  if (method === 'GET' && p === '/homestays/my-homestays') return MOCK_HOMESTAYS.slice(0, 2);
  if (method === 'GET' && p === '/homestays') return { data: MOCK_HOMESTAYS, total: MOCK_HOMESTAYS.length };
  if (method === 'POST' && p === '/homestays') {
    return { id: `hs_new_${Date.now()}`, userId: 'user_owner', ...body, status: 'PENDING', createdAt: new Date().toISOString() };
  }
  if ((method === 'PATCH' || method === 'DELETE') && seg[0] === 'homestays') {
    return method === 'DELETE' ? { message: 'Xóa homestay thành công' } : { id: seg[1], ...body };
  }

  // PRICING SCHEDULES
  if (method === 'GET' && seg[0] === 'pricing-schedules' && seg[1] === 'room' && seg[3] === 'calendar') {
    return mockCalendar(seg[2]);
  }
  if (method === 'GET' && seg[0] === 'pricing-schedules' && seg[1] === 'room') {
    return MOCK_PRICING_SCHEDULES.filter((ps) => ps.roomId === seg[2]);
  }
  if (method === 'POST' && p === '/pricing-schedules') {
    return { id: `ps_new_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
  }
  if ((method === 'PATCH' || method === 'DELETE') && seg[0] === 'pricing-schedules') {
    return method === 'DELETE' ? { message: 'Xóa lịch giá thành công' } : { id: seg[1], ...body };
  }

  // BOOKINGS
  if (method === 'GET' && p === '/bookings/my') return MOCK_BOOKINGS.filter((b) => b.userId === 'user_guest');
  if (method === 'GET' && seg[0] === 'bookings' && seg[1] === 'homestay') {
    const roomIds = MOCK_ROOMS.filter((r) => r.homestayId === seg[2]).map((r) => r.id);
    return MOCK_BOOKINGS.filter((b) => roomIds.includes(b.roomId));
  }
  if (method === 'POST' && p === '/bookings') {
    const room = MOCK_ROOMS.find((r) => r.id === body?.roomId) ?? MOCK_ROOMS[0];
    return { id: `bk_new_${Date.now()}`, userId: 'user_guest', room, ...body, status: 'PENDING', createdAt: new Date().toISOString() };
  }
  if (method === 'PATCH' && seg[0] === 'bookings') {
    const bk = MOCK_BOOKINGS.find((b) => b.id === seg[1]);
    if (seg[2] === 'cancel')   return { ...(bk ?? {}), status: 'CANCELLED' };
    if (seg[2] === 'confirm')  return { ...(bk ?? {}), status: 'CONFIRMED' };
    if (seg[2] === 'complete') return { ...(bk ?? {}), status: 'COMPLETED' };
    return { ...(bk ?? {}), ...body };
  }

  // VOUCHERS
  if (method === 'GET'  && p === '/vouchers') return MOCK_VOUCHERS;
  if (method === 'POST' && p === '/vouchers/validate') {
    const v = MOCK_VOUCHERS.find((vc) => vc.code === body?.code && vc.isActive);
    if (!v) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    return v;
  }
  if (method === 'POST' && p === '/vouchers') {
    return { id: `vc_new_${Date.now()}`, ...body, usedCount: 0, createdAt: new Date().toISOString() };
  }
  if (method === 'PATCH' && seg[0] === 'vouchers' && seg[2] === 'toggle-status') {
    const v = MOCK_VOUCHERS.find((vc) => vc.id === seg[1]);
    return { ...(v ?? {}), isActive: !(v?.isActive ?? true) };
  }
  if ((method === 'PATCH' || method === 'DELETE') && seg[0] === 'vouchers') {
    return method === 'DELETE' ? { message: 'Xóa voucher thành công' } : { id: seg[1], ...body };
  }

  // VOUCHER REDEMPTION
  if (method === 'POST' && p === '/voucher-redemption') {
    return { id: `vr_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
  }

  // USERS (admin)
  if (method === 'GET' && p === '/users') {
    const qs = path.includes('?') ? new URLSearchParams(path.split('?')[1]) : new URLSearchParams();
    const role = qs.get('role');
    return role ? MOCK_USERS.filter((u) => u.role === role) : MOCK_USERS;
  }
  if (method === 'PATCH' && seg[0] === 'users') {
    const u = MOCK_USERS.find((x) => x.id === seg[1]) ?? {};
    if (seg[2] === 'lock')          return { ...u, isLocked: true,  lockReason: body?.reason ?? '' };
    if (seg[2] === 'unlock')        return { ...u, isLocked: false, lockReason: null };
    if (seg[2] === 'approve-owner') return { ...u, role: 'owner', isEmailVerified: true };
    return { ...u, ...body };
  }

  // STATS
  if (method === 'GET' && p === '/stats/summary') return MOCK_STATS_SUMMARY;
  if (method === 'GET' && seg[0] === 'stats') return mockRevenueStats();

  // PAYMENTS
  if (method === 'POST' && p === '/payments') return { ...MOCK_PAYMENT(body?.bookingId ?? 'bk_1'), status: 'waiting_owner_approval', reportedAt: new Date().toISOString() };
  if (method === 'GET' && p === '/payments/owner/me') return [{ ...MOCK_PAYMENT('bk_1'), status: 'waiting_owner_approval' }];
  if (method === 'PATCH' && seg[0] === 'payments' && seg[2] === 'approve') return { ...MOCK_PAYMENT(seg[1]), status: 'completed', paidAt: new Date().toISOString() };
  if (method === 'PATCH' && seg[0] === 'payments' && seg[2] === 'reject') return { ...MOCK_PAYMENT(seg[1]), status: 'rejected' };
  if (method === 'GET'  && seg[0] === 'payments') return { ...MOCK_PAYMENT(seg[1]), status: 'waiting_owner_approval' };

  // BANK ACCOUNTS
  if (method === 'GET'  && p === '/bank-accounts/me') return null;
  if (method === 'POST' && p === '/bank-accounts') return { id: `ba_${Date.now()}`, userId: 'user_owner', ...body, isVerified: false, createdAt: new Date().toISOString() };
  if (method === 'PATCH' && p === '/bank-accounts/me') return { id: 'ba_1', userId: 'user_owner', ...body, isVerified: false };
  if (method === 'DELETE' && p === '/bank-accounts/me') return { message: 'Xóa tài khoản ngân hàng thành công' };
  if (method === 'GET'  && p === '/bank-accounts') return [];

  // fallback
  console.warn(`[MOCK] Unhandled: ${method} ${path}`);
  return null;
}
