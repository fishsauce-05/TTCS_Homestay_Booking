/**
 * Fishsauce Homestay — script.js
 * ─────────────────────────────────────────────────────────────
 * Mục tiêu: Giao diện tĩnh sẵn sàng cắm API NestJS + Google Maps.
 * Không có localStorage, không tự quản lý JWT.
 * Mọi lời gọi API đều là skeleton: bỏ comment TODO là chạy.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   CẤU HÌNH — thay đổi 2 dòng này khi deploy
───────────────────────────────────────────────────────────── */

const API_BASE   = 'http://localhost:3000/api';   // TODO: URL NestJS của bạn
const MAPS_KEY   = 'YOUR_GOOGLE_MAPS_API_KEY';    // TODO: Google Maps API Key
const PAGE_SIZE  = 9;

const MOCK_USERS = [
  {
    id: 'user_customer_01',
    role: 'customer',
    fullname: 'Nguyen Minh Customer',
    email: 'customer@fishsauce.test',
    phone: '0901000001',
    password: '123456',
    avatarText: 'C',
  },
  {
    id: 'user_owner_01',
    role: 'owner',
    fullname: 'Tran Bao Owner',
    email: 'owner@fishsauce.test',
    phone: '0901000002',
    password: '123456',
    avatarText: 'O',
    businessName: 'Fishsauce Garden Homestay',
    ownerStatus: 'approved',
  },
  {
    id: 'user_admin_01',
    role: 'admin',
    fullname: 'Admin Fishsauce',
    email: 'admin@fishsauce.test',
    phone: '0901000003',
    password: '123456',
    avatarText: 'A',
    permissions: ['manage_users', 'manage_rooms', 'manage_bookings', 'manage_reports'],
  },
];

/* ─────────────────────────────────────────────────────────────
   STATE — chỉ giữ những gì UI thực sự cần
───────────────────────────────────────────────────────────── */

const state = {
  currentPage  : 1,
  filters      : {},          // params tìm kiếm / lọc hiện tại
  currentRoomId: null,        // ID phòng đang xem chi tiết
  booking      : {            // dữ liệu checkout
    roomId        : null,
    roomName      : '',
    roomType      : '',
    roomImgUrl    : '',
    nightlyRate   : 0,
    checkinDate   : '',
    checkoutDate  : '',
    nights        : 0,
    subtotal      : 0,
    voucherCode   : '',
    discountAmount: 0,
    totalAmount   : 0,
  },
};

/* ═══════════════════════════════════════════════════════════════
   1. ĐIỀU HƯỚNG SPA
═══════════════════════════════════════════════════════════════ */

function showSection(name) {
  document.querySelectorAll('.app-section').forEach(s => {
    s.classList.remove('active');
    s.style.opacity = '0';
  });

  const el = document.getElementById(`section-${name}`);
  if (!el) return;
  el.classList.add('active');
  requestAnimationFrame(() => (el.style.opacity = '1'));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'home')        fetchFeaturedRooms();
  if (name === 'rooms')       fetchRooms();
  if (name === 'my-bookings') fetchMyBookings();
}

function goBackToDetail() {
  showSection(state.currentRoomId ? 'room-detail' : 'rooms');
}

/* ═══════════════════════════════════════════════════════════════
   2. API — DANH SÁCH PHÒNG
   GET /rooms?location=&checkin=&checkout=&guests=&types=&amenities=
             &priceMin=&priceMax=&sort=&page=&pageSize=
═══════════════════════════════════════════════════════════════ */

async function fetchRooms(extraParams = {}) {
  const params = new URLSearchParams({
    ...state.filters,
    ...extraParams,
    page    : state.currentPage,
    pageSize: PAGE_SIZE,
  });

  showSkeletonCards('rooms-list', PAGE_SIZE);

  /* TODO: bỏ comment khi NestJS sẵn sàng
  const res  = await fetch(`${API_BASE}/rooms?${params}`);
  const body = await res.json();
  // body = { data: Room[], total: number, page: number }
  renderRoomList(body.data, 'rooms-list');
  renderPagination(body.total, body.page);
  setText('rooms-count', body.total);
  */

  // ── MOCK (xóa khi có API) ─────────────────────────────────
  await delay(700);
  const mock = mockRooms(PAGE_SIZE);
  renderRoomList(mock, 'rooms-list');
  renderPagination(24, state.currentPage);
  setText('rooms-count', 24);
  // ─────────────────────────────────────────────────────────
}

/* ─────────────────────────────────────────────────────────────
   API — PHÒNG NỔI BẬT (trang Home)
   GET /rooms/featured?limit=6
───────────────────────────────────────────────────────────── */

async function fetchFeaturedRooms() {
  showSkeletonCards('featured-rooms-list', 3);

  /* TODO:
  const res  = await fetch(`${API_BASE}/rooms/featured?limit=6`);
  const body = await res.json();
  renderRoomList(body.data, 'featured-rooms-list');
  renderCategoryPills(body.categories);
  */

  await delay(600);
  renderRoomList(mockRooms(3), 'featured-rooms-list');
  renderCategoryPills();
}

/* ─────────────────────────────────────────────────────────────
   API — CHI TIẾT PHÒNG
   GET /rooms/:id
───────────────────────────────────────────────────────────── */

async function fetchRoomDetail(roomId) {
  state.currentRoomId = roomId;
  showSection('room-detail');
  showDetailSkeleton();

  /* TODO:
  const res  = await fetch(`${API_BASE}/rooms/${roomId}`);
  const room = await res.json();
  renderRoomDetails(room);
  */

  await delay(600);
  renderRoomDetails(mockRoomDetail(roomId));
}

/* ─────────────────────────────────────────────────────────────
   API — TẠO ĐƠN ĐẶT PHÒNG
   POST /bookings
   Body: { roomId, fullname, phone, email, checkinDate, checkoutDate,
           guestsCount, specialRequest, voucherCode }
   Response: { bookingCode, paymentQrUrl, bankInfo: { bankName,
               accountNumber, accountName, transferContent } }
───────────────────────────────────────────────────────────── */

async function createBooking() {
  if (!validateCheckoutForm()) return;

  const payload = {
    roomId        : state.booking.roomId,
    fullname      : getVal('booking-fullname'),
    phone         : getVal('booking-phone'),
    email         : getVal('booking-email'),
    checkinDate   : getVal('booking-checkin'),
    checkoutDate  : getVal('booking-checkout'),
    guestsCount   : Number(getVal('booking-guests-count')) || 1,
    specialRequest: getVal('booking-note'),
    voucherCode   : state.booking.voucherCode,
  };

  setBtnLoading('btn-confirm-booking', true);

  try {
    /* TODO:
    const res  = await fetch(`${API_BASE}/bookings`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    const result = await res.json();
    onBookingSuccess(result);
    */

    await delay(1200);
    onBookingSuccess({
      bookingCode  : 'FS-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      paymentQrUrl : `https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${state.booking.totalAmount}&addInfo=Fishsauce%20Homestay`,
      bankInfo     : {
        bankName       : 'MB Bank',
        accountNumber  : '0123456789',
        accountName    : 'FISHSAUCE HOMESTAY',
        transferContent: `DP ${state.booking.roomId} ${Date.now()}`,
      },
    });

  } catch (err) {
    toast(err.message || 'Đặt phòng thất bại, vui lòng thử lại.', 'danger');
  } finally {
    setBtnLoading('btn-confirm-booking', false);
  }
}

/* ─────────────────────────────────────────────────────────────
   API — KIỂM TRA VOUCHER
   POST /vouchers/validate
   Body: { code, roomId }
   Response: { valid, type: 'percent'|'fixed', value, description }
───────────────────────────────────────────────────────────── */

async function validateVoucherAPI(code) {
  /* TODO:
  const res  = await fetch(`${API_BASE}/vouchers/validate`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ code, roomId: state.booking.roomId }),
  });
  if (res.status === 400 || res.status === 404) return null;
  return await res.json();
  */

  await delay(500);
  const demo = {
    FISHSAUCE10: { valid: true, type: 'percent', value: 10,     description: 'Giảm 10%' },
    SUMMER20   : { valid: true, type: 'percent', value: 20,     description: 'Giảm 20% mùa hè' },
    WELCOME50K : { valid: true, type: 'fixed',   value: 50000,  description: 'Giảm 50,000đ' },
    NEWUSER100K: { valid: true, type: 'fixed',   value: 100000, description: 'Giảm 100,000đ khách mới' },
  };
  return demo[code.toUpperCase()] ?? null;
}

/* ─────────────────────────────────────────────────────────────
   API — LỊCH ĐẶT PHÒNG CỦA TÔI
   GET /bookings/me?status=all|pending|confirmed|completed|cancelled
───────────────────────────────────────────────────────────── */

async function fetchMyBookings(status = 'all') {
  const qs = status !== 'all' ? `?status=${status}` : '';

  /* TODO:
  const res  = await fetch(`${API_BASE}/bookings/me${qs}`);
  const body = await res.json();
  renderMyBookings(body.data);
  */

  await delay(500);
  renderMyBookings([]);
}

/* ═══════════════════════════════════════════════════════════════
   3. GOOGLE MAPS — nhúng Embed API vào iframe
   Không cần JS SDK, không tốn quota cao
═══════════════════════════════════════════════════════════════ */

/**
 * @param {number} lat
 * @param {number} lng
 * @param {string} label — tên địa điểm hiển thị trên bản đồ
 */
function embedGoogleMap(lat, lng, label) {
  const iframe = document.getElementById('detail-map-iframe');
  if (!iframe) return;

  // Khi có key thật: dùng Maps Embed API (ngôn ngữ VI, không cần thêm SDK)
  // TODO: thay YOUR_GOOGLE_MAPS_API_KEY
  if (MAPS_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    iframe.src = `https://www.google.com/maps/embed/v1/place`
      + `?key=${MAPS_KEY}`
      + `&q=${encodeURIComponent(label)}`
      + `&center=${lat},${lng}`
      + `&zoom=15`
      + `&language=vi`;
  } else {
    // Fallback không cần key (maps.google.com thường)
    iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed&hl=vi`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   4. RENDER — DANH SÁCH PHÒNG
═══════════════════════════════════════════════════════════════ */

function renderRoomList(rooms, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;

  if (!rooms?.length) {
    box.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-house-slash fs-1 text-muted d-block mb-3"></i>
        <p class="text-muted">Không tìm thấy homestay phù hợp.</p>
        <button class="btn btn-brand-outline mt-2" onclick="resetFilters()">Đặt lại bộ lọc</button>
      </div>`;
    return;
  }

  box.innerHTML = rooms.map(buildRoomCard).join('');

  box.querySelectorAll('.room-card').forEach((c, i) => {
    c.style.cssText = 'opacity:0;transform:translateY(20px)';
    setTimeout(() => {
      c.style.cssText = 'transition:opacity .3s ease,transform .3s ease;opacity:1;transform:translateY(0)';
    }, i * 55);
  });
}

/**
 * HTML card phòng — data-bind khớp với field NestJS trả về.
 */
function buildRoomCard(r) {
  return `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="room-card"
           data-room-id="${r.id}"
           onclick="fetchRoomDetail('${r.id}')">
        <div class="room-card-img-wrap">
          <img class="room-card-img"
               src="${r.thumbnail ?? placeholder(400,200)}"
               alt="${r.name}"
               loading="lazy"
               data-bind="thumbnail" />
          <span class="room-card-badge" data-bind="room_type_label">${r.typeLabel ?? ''}</span>
          <button class="room-card-fav" onclick="toggleFavorite(event,'${r.id}')">
            <i class="bi bi-heart"></i>
          </button>
        </div>
        <div class="room-card-body">
          <div class="room-card-type"  data-bind="room_type">${r.type ?? ''}</div>
          <div class="room-card-name"  data-bind="room_name">${r.name ?? ''}</div>
          <div class="room-card-meta">
            <span data-bind="location"><i class="bi bi-geo-alt me-1"></i>${r.location ?? ''}</span>
            <span data-bind="capacity"><i class="bi bi-people me-1"></i>${r.capacity ?? '?'} khách</span>
          </div>
          <div class="room-card-footer">
            <div class="room-card-price" data-bind="nightly_rate_formatted">
              ${r.priceFormatted ?? '—'}<small>/đêm</small>
            </div>
            <div class="room-card-rating" data-bind="avg_rating">
              <i class="bi bi-star-fill text-warning"></i>
              ${r.rating ?? '—'}
              <span class="text-muted">(${r.reviewCount ?? 0})</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   5. RENDER — CHI TIẾT PHÒNG
═══════════════════════════════════════════════════════════════ */

function renderRoomDetails(room) {
  setText('breadcrumb-room-name', room.name);
  setText('detail-room-name',     room.name);
  setText('detail-room-type',     room.typeLabel);
  setText('detail-room-location', room.location);
  setText('detail-room-price',    room.priceFormatted);
  setText('widget-price',         room.priceFormatted);
  setText('widget-rating',        room.rating);
  setText('widget-review-count',  room.reviewCount);
  setText('detail-capacity',      `${room.capacity} khách`);
  setText('detail-type-txt',       room.typeLabel);
  setText('detail-rating',         room.rating);
  setText('detail-review-count',  `${room.reviewCount} nhận xét`);

  const descEl = document.getElementById('detail-description');
  if (descEl) { descEl.textContent = room.description ?? ''; descEl.classList.remove('skeleton-para'); }

  renderGallery(room.images ?? []);
  renderAmenities(room.amenities ?? []);
  renderReviews(room.reviews ?? [], room.avgRating ?? null);
  if (room.lat && room.lng) embedGoogleMap(room.lat, room.lng, room.name);

  const zaloBtn = document.getElementById('btn-zalo-check');
  if (zaloBtn && room.zaloLink) zaloBtn.href = room.zaloLink;

  const btnBook = document.getElementById('btn-book-now');
  if (btnBook) {
    Object.assign(btnBook.dataset, {
      roomId   : room.id,
      roomName : room.name,
      roomPrice: room.nightlyRate,
      roomType : room.typeLabel,
      roomImg  : room.images?.[0] ?? '',
    });
  }

  document.querySelectorAll('#section-room-detail .skeleton-text-lg, #section-room-detail .skeleton-badge')
    .forEach(el => el.classList.remove('skeleton-text-lg', 'skeleton-badge'));
}

function renderGallery(images) {
  const box = document.getElementById('detail-gallery');
  if (!box) return;
  const [main, ...thumbs] = images.length ? images : [placeholder(800, 420)];
  box.innerHTML = `
    <div class="gallery-main">
      <img src="${main}" alt="Ảnh chính" id="gallery-main-img" data-bind="primary_image" />
    </div>
    <div class="gallery-thumbs mt-2 row g-2">
      ${thumbs.slice(0,4).map(img => `
        <div class="col-3">
          <div class="gallery-thumb" onclick="document.getElementById('gallery-main-img').src='${img}'">
            <img src="${img}" alt="" />
          </div>
        </div>`).join('')}
    </div>`;
}

function renderAmenities(amenities) {
  const box = document.getElementById('detail-amenities');
  if (!box) return;
  if (!amenities.length) { box.innerHTML = '<p class="text-muted small">Chưa cập nhật.</p>'; return; }
  box.innerHTML = amenities.map(a => `
    <div class="amenity-item" data-amenity-id="${a.id ?? a.label}">
      <i class="${a.icon ?? 'bi bi-check-circle-fill'}"></i>
      <span>${a.label}</span>
    </div>`).join('');
}

function renderReviews(reviews, avgRating) {
  const summaryEl = document.getElementById('detail-reviews-summary');
  if (summaryEl) {
    summaryEl.innerHTML = avgRating
      ? `<div class="rating-big">${avgRating.toFixed(1)}</div>
         <div><div class="text-warning mb-1">${stars(avgRating)}</div>
         <div class="text-muted small">Điểm trung bình</div></div>`
      : '<p class="text-muted small mb-0">Chưa có đánh giá</p>';
  }
  const listEl = document.getElementById('detail-reviews-list');
  if (!listEl) return;
  if (!reviews.length) { listEl.innerHTML = '<p class="text-muted small py-3">Chưa có nhận xét nào.</p>'; return; }
  listEl.innerHTML = reviews.map(r => `
    <div class="review-card" data-review-id="${r.id ?? ''}">
      <div class="review-avatar">${r.author?.[0] ?? 'K'}</div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between">
          <span class="review-author">${r.author ?? 'Ẩn danh'}</span>
          <span class="review-date">${r.date ?? ''}</span>
        </div>
        <div class="text-warning small mb-1">${stars(r.rating ?? 5)}</div>
        <p class="review-text mb-0">${r.content ?? ''}</p>
      </div>
    </div>`).join('');
}

function renderCategoryPills() {
  const box = document.getElementById('categories-list');
  if (!box) return;
  const cats = [
    { icon:'🏖️', name:'Biển',      query:'beach'       },
    { icon:'🏔️', name:'Núi',       query:'mountain'    },
    { icon:'🌾', name:'Đồng quê',  query:'countryside' },
    { icon:'🏙️', name:'Thành phố', query:'city'        },
    { icon:'🌿', name:'Sinh thái', query:'eco'         },
    { icon:'🏰', name:'Di sản',    query:'heritage'    },
  ];
  box.innerHTML = cats.map(c => `
    <div class="col-6 col-md-4 col-lg-2">
      <a class="category-pill" href="#" onclick="searchByCategory('${c.query}')">
        <span class="category-pill-icon">${c.icon}</span>
        <span class="category-pill-name">${c.name}</span>
      </a>
    </div>`).join('');
}

function renderPagination(total, currentPage) {
  const box = document.getElementById('pagination-list');
  if (!box) return;
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) { box.innerHTML = ''; return; }

  const range = pages <= 7
    ? Array.from({length: pages}, (_, i) => i + 1)
    : currentPage <= 3  ? [1,2,3,4,'...',pages]
    : currentPage >= pages-2 ? [1,'...',pages-3,pages-2,pages-1,pages]
    : [1,'...',currentPage-1,currentPage,currentPage+1,'...',pages];

  box.innerHTML = `
    <li class="page-item ${currentPage===1?'disabled':''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage-1})"><i class="bi bi-chevron-left"></i></a>
    </li>
    ${range.map(p => p === '...'
      ? '<li class="page-item disabled"><span class="page-link">…</span></li>'
      : `<li class="page-item ${p===currentPage?'active':''}">
           <a class="page-link" href="#" onclick="changePage(${p})">${p}</a>
         </li>`).join('')}
    <li class="page-item ${currentPage===pages?'disabled':''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage+1})"><i class="bi bi-chevron-right"></i></a>
    </li>`;
}

function renderMyBookings(bookings) {
  const box = document.getElementById('my-bookings-list');
  if (!box) return;
  if (!bookings.length) {
    box.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
        <p>Chưa có đặt phòng nào.</p>
        <button class="btn btn-brand mt-2" onclick="showSection('rooms')">Tìm Homestay ngay</button>
      </div>`;
    return;
  }
  box.innerHTML = bookings.map(b => `
    <div class="booking-list-item mb-3" data-booking-id="${b.id ?? ''}">
      <div class="summary-room-img">
        <img src="${b.roomImg ?? placeholder(80,65)}" alt="${b.roomName ?? ''}" />
      </div>
      <div class="flex-grow-1">
        <div class="fw-600 mb-1">${b.roomName ?? '—'}</div>
        <div class="text-muted small">${b.checkin} → ${b.checkout}</div>
        <div class="text-muted small">Mã: ${b.code ?? '—'}</div>
      </div>
      <div class="text-end">
        <span class="badge status-${b.status ?? 'pending'}">${statusLabel(b.status)}</span>
        <div class="mt-1 text-brand fw-600 small">${b.totalFormatted ?? '—'}</div>
      </div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════════
   6. TÌM KIẾM & LỌC
═══════════════════════════════════════════════════════════════ */

function handleSearch() {
  const raw = {
    location: getVal('search-location'),
    checkin : getVal('search-checkin'),
    checkout: getVal('search-checkout'),
    guests  : getVal('search-guests'),
  };
  state.filters = Object.fromEntries(Object.entries(raw).filter(([, v]) => v));
  state.currentPage = 1;
  showSection('rooms');
}

function applyFilters() {
  const types     = ['single','double','family'].filter(t => document.getElementById(`f-${t}`)?.checked);
  const amenities = ['wifi','ac','parking','pool'].filter(a => document.getElementById(`f-${a}`)?.checked);
  state.filters = {
    ...state.filters,
    ...(types.length     && { types: types.join(',') }),
    ...(amenities.length && { amenities: amenities.join(',') }),
    ...(getVal('f-capacity-min') && { capacityMin: getVal('f-capacity-min') }),
    ...(getVal('f-capacity-max') && { capacityMax: getVal('f-capacity-max') }),
    ...(getVal('f-price-min')    && { priceMin:    getVal('f-price-min')    }),
    ...(getVal('f-price-max')    && { priceMax:    getVal('f-price-max')    }),
  };
  state.currentPage = 1;
  fetchRooms();
}

function resetFilters() {
  ['f-single','f-double','f-family','f-wifi','f-ac','f-parking','f-pool']
    .forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });
  ['f-capacity-min','f-capacity-max','f-price-min','f-price-max'].forEach(id => setVal(id, ''));
  state.filters     = {};
  state.currentPage = 1;
  fetchRooms();
}

function handleSort(value) {
  state.filters     = { ...state.filters, sort: value };
  state.currentPage = 1;
  fetchRooms();
}

function searchByCategory(category) {
  state.filters     = { category };
  state.currentPage = 1;
  showSection('rooms');
}

function changePage(page) {
  if (page < 1) return;
  state.currentPage = page;
  fetchRooms();
}

function filterMyBookings(status) {
  document.querySelectorAll('#bookingTabs .nav-link').forEach(b => b.classList.remove('active'));
  event?.target?.classList.add('active');
  fetchMyBookings(status);
}

/* ═══════════════════════════════════════════════════════════════
   7. CHECKOUT — TÍNH TOÁN
═══════════════════════════════════════════════════════════════ */

/** Chuyển sang trang checkout từ trang chi tiết */
function goToBooking() {
  const btn     = document.getElementById('btn-book-now');
  const checkin = getVal('widget-checkin');
  const checkout= getVal('widget-checkout');
  const nights  = nightsBetween(checkin, checkout);

  if (nights <= 0) {
    toast('Vui lòng chọn ngày Check-in và Check-out hợp lệ.', 'warning');
    return;
  }

  const rate = Number(btn?.dataset.roomPrice) || 0;
  Object.assign(state.booking, {
    roomId        : btn?.dataset.roomId   ?? '',
    roomName      : btn?.dataset.roomName ?? '',
    roomType      : btn?.dataset.roomType ?? '',
    roomImgUrl    : btn?.dataset.roomImg  ?? '',
    nightlyRate   : rate,
    checkinDate   : checkin,
    checkoutDate  : checkout,
    nights,
    subtotal      : nights * rate,
    voucherCode   : '',
    discountAmount: 0,
    totalAmount   : nights * rate,
    guestsCount   : Number(getVal('widget-guests')) || 1,
  });

  // Đẩy params lên URL — để user có thể bookmark / back và tự điền lại
  const url = new URL(location.href);
  url.searchParams.set('roomId',   state.booking.roomId);
  url.searchParams.set('roomName', state.booking.roomName);
  url.searchParams.set('price',    rate);
  url.searchParams.set('checkin',  checkin);
  url.searchParams.set('checkout', checkout);
  history.replaceState({}, '', url);

  populateCheckout();
  showSection('checkout');
}

/**
 * Đọc URL params → tự điền checkout khi user load thẳng link.
 * Ví dụ: ?roomId=room_1&roomName=Villa%20Sương%20Mai&price=1200000&checkin=2025-09-01&checkout=2025-09-03
 */
function restoreCheckoutFromURL() {
  const p = new URLSearchParams(location.search);
  if (!p.get('roomId')) return false;

  const nights = nightsBetween(p.get('checkin'), p.get('checkout'));
  const rate   = Number(p.get('price')) || 0;
  Object.assign(state.booking, {
    roomId      : p.get('roomId')   ?? '',
    roomName    : p.get('roomName') ?? '',
    nightlyRate : rate,
    checkinDate : p.get('checkin')  ?? '',
    checkoutDate: p.get('checkout') ?? '',
    nights      : Math.max(nights, 0),
    subtotal    : nights * rate,
    totalAmount : nights * rate,
  });

  populateCheckout();
  return true;
}

function populateCheckout() {
  const b = state.booking;
  setVal('booking-checkin',      b.checkinDate);
  setVal('booking-checkout',     b.checkoutDate);
  setVal('booking-guests-count', b.guestsCount ?? 1);
  setText('summary-room-name',   b.roomName);
  setText('summary-room-type',   b.roomType);

  const imgWrap = document.getElementById('summary-room-img');
  if (imgWrap) {
    imgWrap.innerHTML = `<img src="${b.roomImgUrl || placeholder(80,65)}" alt="${b.roomName}" />`;
    imgWrap.classList.remove('skeleton-summary-img');
  }
  refreshSummary();
}

/** Tái tính khi user đổi ngày trong form checkout */
function recalcTotal() {
  const checkin  = getVal('booking-checkin');
  const checkout = getVal('booking-checkout');
  const errEl    = document.getElementById('booking-date-error');
  const nights   = nightsBetween(checkin, checkout);

  if (nights <= 0) { errEl?.classList.remove('d-none'); return; }
  errEl?.classList.add('d-none');

  state.booking.checkinDate  = checkin;
  state.booking.checkoutDate = checkout;
  state.booking.nights       = nights;
  state.booking.subtotal     = nights * state.booking.nightlyRate;

  if (state.booking.voucherCode) applyDiscount();
  else { state.booking.discountAmount = 0; state.booking.totalAmount = state.booking.subtotal; }

  refreshSummary();
}

function refreshSummary() {
  const b = state.booking;
  setText('summary-base-price', fmtVND(b.nightlyRate));
  setText('summary-nights',     `${b.nights} đêm`);
  setText('summary-subtotal',   b.nights > 0 ? fmtVND(b.subtotal)    : '—');
  setText('summary-total',      b.nights > 0 ? fmtVND(b.totalAmount) : '—');
  if (b.totalAmount > 0) refreshQR(b.totalAmount);
}

/** Cập nhật QR VietQR theo số tiền */
function refreshQR(amount) {
  // TODO: thay bankCode + accountNo bằng thông tin từ API /payment/bank-info
  const bankCode  = 'MB';
  const accountNo = '0123456789';
  const info      = encodeURIComponent(`Dat phong Fishsauce Homestay ${state.booking.roomId}`);
  const qr        = document.getElementById('qr-payment-img');
  if (qr) {
    qr.src = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${amount}&addInfo=${info}`;
    qr.classList.remove('skeleton-qr');
  }
}

/* ═══════════════════════════════════════════════════════════════
   8. VOUCHER
═══════════════════════════════════════════════════════════════ */

async function applyVoucher() {
  const code      = getVal('voucher-input').trim().toUpperCase();
  const successEl = document.getElementById('voucher-success');
  const errorEl   = document.getElementById('voucher-error');
  successEl?.classList.add('d-none');
  errorEl?.classList.add('d-none');
  document.getElementById('discount-row-container')?.classList.add('d-none');

  if (!code) { toast('Vui lòng nhập mã voucher.', 'warning'); return; }
  setBtnLoading('btn-apply-voucher', true);

  try {
    const voucher = await validateVoucherAPI(code);
    if (!voucher?.valid) {
      setText('voucher-error-msg', 'Mã voucher không hợp lệ hoặc đã hết hạn.');
      errorEl?.classList.remove('d-none');
      state.booking.voucherCode    = '';
      state.booking.discountAmount = 0;
      state.booking.totalAmount    = state.booking.subtotal;
      refreshSummary();
      return;
    }

    state.booking.voucherCode   = code;
    state.booking.discountType  = voucher.type;
    state.booking.discountValue = voucher.value;
    applyDiscount();

    const saved = fmtVND(state.booking.discountAmount);
    setText('voucher-success-msg',     `${voucher.description} — Đã giảm:`);
    setText('voucher-discount-display', saved);
    setText('voucher-code-display',    code);
    setText('summary-discount',        `-${saved}`);
    successEl?.classList.remove('d-none');
    document.getElementById('discount-row-container')?.classList.remove('d-none');
    toast(`✅ Voucher ${code}: tiết kiệm ${saved}`, 'success');

  } finally {
    setBtnLoading('btn-apply-voucher', false);
  }
}

function applyDiscount() {
  const b = state.booking;
  b.discountAmount = b.discountType === 'percent'
    ? Math.floor(b.subtotal * b.discountValue / 100)
    : Math.min(b.discountValue, b.subtotal);
  b.totalAmount = Math.max(0, b.subtotal - b.discountAmount);
  refreshSummary();
}

/* ═══════════════════════════════════════════════════════════════
   9. WIDGET NGÀY (trang Detail)
═══════════════════════════════════════════════════════════════ */

function calcWidgetNights() {
  const nights = nightsBetween(getVal('widget-checkin'), getVal('widget-checkout'));
  const errEl  = document.getElementById('widget-date-error');
  const rowEl  = document.getElementById('widget-nights-row');
  if (nights <= 0) { errEl?.classList.remove('d-none'); rowEl?.classList.add('d-none'); return; }
  errEl?.classList.add('d-none'); rowEl?.classList.remove('d-none');
  const rate = Number(document.getElementById('btn-book-now')?.dataset.roomPrice) || 0;
  setText('widget-nights-label',    `${nights} đêm × ${fmtVND(rate)}`);
  setText('widget-nights-subtotal', fmtVND(nights * rate));
}

/* ═══════════════════════════════════════════════════════════════
   10. AUTH — shell, bạn tự xử lý token/session
═══════════════════════════════════════════════════════════════ */

async function handleLogin() {
  const errEl = document.getElementById('login-error-msg');
  errEl?.classList.add('d-none');
  setBtnLoading('btn-login-submit', true);
  try {
    /* TODO:
    const res = await fetch(`${API_BASE}/auth/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ identifier: getVal('login-email'), password: getVal('login-password'), role: loginType }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    const { token, user } = await res.json();
    // Bạn tự lưu token theo cách của mình (cookie, Pinia, Redux, ...)
    onLoginSuccess(user);
    */
    const identifier = getVal('login-email').trim().toLowerCase();
    const password = getVal('login-password');
    const user = MOCK_USERS.find(u =>
      u.role === loginType &&
      (u.email.toLowerCase() === identifier || u.phone === identifier) &&
      u.password === password
    );
    if (!user) throw new Error('Sai tài khoản, mật khẩu hoặc role đăng nhập.');
    onLoginSuccess(user);
    toast('Đăng nhập thành công! (stub)', 'success');
    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
  } catch (err) {
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove('d-none'); }
  } finally {
    setBtnLoading('btn-login-submit', false);
  }
}

async function handleRegister() {
  const errEl  = document.getElementById('register-error-msg');
  const succEl = document.getElementById('register-success-msg');
  errEl?.classList.add('d-none'); succEl?.classList.add('d-none');

  if (getVal('reg-password') !== getVal('reg-password-confirm')) {
    errEl.textContent = 'Mật khẩu xác nhận không khớp.'; errEl.classList.remove('d-none'); return;
  }
  if (!document.getElementById('reg-agree-terms')?.checked) {
    errEl.textContent = 'Vui lòng đồng ý với Điều khoản sử dụng.'; errEl.classList.remove('d-none'); return;
  }
  setBtnLoading('btn-register-submit', true);
  try {
    /* TODO:
    const res = await fetch(`${API_BASE}/auth/register`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ fullname: getVal('reg-fullname'), phone: getVal('reg-phone'),
                                email: getVal('reg-email'), password: getVal('reg-password'), role: 'customer' }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    succEl.textContent = (await res.json()).message; succEl.classList.remove('d-none');
    */
    succEl.textContent = 'Đăng ký thành công! (stub)'; succEl.classList.remove('d-none');
  } catch (err) {
    errEl.textContent = err.message; errEl.classList.remove('d-none');
  } finally {
    setBtnLoading('btn-register-submit', false);
  }
}

/** Gọi hàm này sau khi nhận được user object từ API của bạn */
function onLoginSuccess(user) {
  setText('nav-username', user.fullname?.split(' ').pop() ?? 'Tôi');
  const av = document.getElementById('nav-user-avatar');
  if (av) av.textContent = user.avatarText ?? user.fullname?.[0]?.toUpperCase() ?? 'U';
  document.getElementById('nav-guest-section')?.classList.add('d-none');
  document.getElementById('nav-register-btn')?.classList.add('d-none');
  document.getElementById('nav-user-section')?.classList.remove('d-none');
  document.getElementById('nav-owner-section')?.classList.toggle('d-none', user.role !== 'owner');
  document.getElementById('nav-admin-section')?.classList.toggle('d-none', user.role !== 'admin');
  if (user.role === 'admin') showSection('admin-dashboard');
}

function handleLogout() {
  // TODO: POST /auth/logout nếu cần invalidate token phía server
  document.getElementById('nav-guest-section')?.classList.remove('d-none');
  document.getElementById('nav-register-btn')?.classList.remove('d-none');
  document.getElementById('nav-user-section')?.classList.add('d-none');
  document.getElementById('nav-owner-section')?.classList.add('d-none');
  document.getElementById('nav-admin-section')?.classList.add('d-none');
  toast('Đã đăng xuất.', 'info');
  showSection('home');
}

let loginType = 'customer';
const registerType = 'customer';

function switchLoginType(type) {
  loginType = type;
  document.querySelectorAll('#loginTypeTabs .nav-link').forEach((b, i) =>
    b.classList.toggle('active', (type==='customer'&&i===0)||(type==='owner'&&i===1)||(type==='admin'&&i===2)));
}

function switchRegisterType(type) {
  type = 'customer';
  document.querySelectorAll('#registerTypeTabs .nav-link').forEach((b, i) =>
    b.classList.toggle('active', i === 0));
  document.querySelectorAll('.owner-only-field')
    .forEach(el => el.classList.add('d-none'));
}

function togglePasswordVisibility(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

/* ═══════════════════════════════════════════════════════════════
   11. MISC UI
═══════════════════════════════════════════════════════════════ */

function toggleFavorite(e, roomId) {
  e.stopPropagation();
  const btn = e.currentTarget;
  btn.classList.toggle('active');
  btn.querySelector('i')?.classList.toggle('bi-heart');
  btn.querySelector('i')?.classList.toggle('bi-heart-fill');
  // TODO: POST/DELETE /favorites/:roomId
}

function loadMoreReviews() {
  // TODO: fetch(`${API_BASE}/rooms/${state.currentRoomId}/reviews?offset=...`)
}

function onBookingSuccess(result) {
  const qr = document.getElementById('qr-payment-img');
  if (qr && result.paymentQrUrl) { qr.src = result.paymentQrUrl; qr.classList.remove('skeleton-qr'); }
  if (result.bankInfo) {
    setText('bank-name',            result.bankInfo.bankName);
    setText('bank-account-number',  result.bankInfo.accountNumber);
    setText('bank-account-name',    result.bankInfo.accountName);
    setText('bank-transfer-content',result.bankInfo.transferContent);
  }
  setText('success-booking-code', result.bookingCode);
  const sumEl = document.getElementById('success-summary');
  if (sumEl) sumEl.innerHTML = `
    <div class="price-row"><span>Phòng</span><strong>${state.booking.roomName}</strong></div>
    <div class="price-row"><span>Check-in</span><strong>${fmtDate(state.booking.checkinDate)}</strong></div>
    <div class="price-row"><span>Check-out</span><strong>${fmtDate(state.booking.checkoutDate)}</strong></div>
    <div class="price-row price-subtotal"><span>Tổng</span><strong>${fmtVND(state.booking.totalAmount)}</strong></div>`;
  showSection('booking-success');
  toast('🎉 Đặt phòng thành công!', 'success');
}

function validateCheckoutForm() {
  const fields = [
    { id:'booking-fullname', label:'Họ tên'       },
    { id:'booking-phone',    label:'Số điện thoại' },
    { id:'booking-checkin',  label:'Ngày Check-in'  },
    { id:'booking-checkout', label:'Ngày Check-out' },
  ];
  for (const f of fields) {
    if (!getVal(f.id).trim()) { toast(`Vui lòng nhập ${f.label}.`, 'warning'); document.getElementById(f.id)?.focus(); return false; }
  }
  if (nightsBetween(getVal('booking-checkin'), getVal('booking-checkout')) <= 0) {
    document.getElementById('booking-date-error')?.classList.remove('d-none'); return false;
  }
  return true;
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

const nightsBetween = (a, b) => {
  if (!a || !b) return 0;
  const d = Math.floor((new Date(b) - new Date(a)) / 86400000);
  return d > 0 ? d : 0;
};

const fmtVND  = n => n != null
  ? new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND' }).format(n) : '—';
const fmtDate = s => s ? new Date(s).toLocaleDateString('vi-VN') : '—';
const stars   = r =>
  '<i class="bi bi-star-fill"></i>'.repeat(Math.floor(r)) +
  (r%1>=.5 ? '<i class="bi bi-star-half"></i>' : '') +
  '<i class="bi bi-star"></i>'.repeat(5 - Math.ceil(r));
const statusLabel = s =>
  ({ pending:'Chờ xác nhận', confirmed:'Đã xác nhận', completed:'Hoàn thành', cancelled:'Đã hủy' }[s] ?? s ?? '—');
const placeholder = (w, h) => `https://placehold.co/${w}x${h}/f0e6d9/b5835a?text=Fishsauce+Homestay`;
const getVal  = id  => document.getElementById(id)?.value ?? '';
const setVal  = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t ?? ''; };
const delay   = ms => new Promise(r => setTimeout(r, ms));

function toast(msg, type = 'primary') {
  const el  = document.getElementById('app-toast');
  const txt = document.getElementById('toast-message');
  if (!el || !txt) return;
  const bg = { success:'bg-success', danger:'bg-danger', warning:'bg-warning text-dark', info:'bg-info text-dark' }[type] ?? 'bg-dark';
  el.className = `toast align-items-center text-white border-0 ${bg}`;
  txt.textContent = msg;
  new bootstrap.Toast(el, { delay: 3500 }).show();
}

function setBtnLoading(id, on) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = on;
  btn.querySelector('.spinner-border')?.classList.toggle('d-none', !on);
}

function showSkeletonCards(containerId, count) {
  const box = document.getElementById(containerId);
  if (box) box.innerHTML = Array(count).fill(0).map(() =>
    '<div class="col-12 col-md-6 col-xl-4"><div class="room-card skeleton-card"></div></div>').join('');
}

function showDetailSkeleton() {
  setText('detail-room-name', '');
  document.getElementById('detail-room-name')?.classList.add('skeleton-text-lg');
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — xóa toàn bộ block này khi NestJS sẵn sàng
═══════════════════════════════════════════════════════════════ */

function mockRooms(n) {
  const names  = ['Villa Sương Mai','Homestay Bình Yên','Garden House Xanh','Sunrise Loft','Mây Trắng Retreat','Terra Homestay','La Campagne','Bamboo Nest','SeaBreeze Home'];
  const locs   = ['Đà Lạt','Hội An','Phú Quốc','Hà Nội','Đà Nẵng'];
  const types  = ['Phòng Đơn','Phòng Đôi','Phòng Gia Đình'];
  const prices = [450000,650000,850000,1200000,980000];
  const imgs   = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop&q=60',
  ];
  return Array.from({length: n}, (_, i) => {
    const p = prices[i % prices.length];
    return { id:`room_${i+1}`, name:names[i%names.length], type:types[i%types.length].toUpperCase(),
             typeLabel:types[i%types.length], location:locs[i%locs.length],
             capacity:(i%4)+2, nightlyRate:p, priceFormatted:fmtVND(p),
             rating:(4+i*0.1%1).toFixed(1), reviewCount:10+i*3, thumbnail:imgs[i%imgs.length] };
  });
}

function mockRoomDetail(id) {
  return {
    id, name:'Villa Sương Mai', typeLabel:'Phòng Gia Đình', type:'FAMILY',
    location:'Đà Lạt, Lâm Đồng', capacity:6, nightlyRate:1200000,
    priceFormatted:fmtVND(1200000), rating:4.8, avgRating:4.8, reviewCount:42,
    description:'Villa Sương Mai tọa lạc trên đồi thông yên tĩnh, tầm nhìn 360° nhìn ra thung lũng. Phù hợp gia đình hoặc nhóm bạn muốn tận hưởng không gian riêng tư.',
    amenities:[
      {id:'wifi',    icon:'bi bi-wifi',        label:'WiFi tốc độ cao'},
      {id:'ac',      icon:'bi bi-thermometer', label:'Điều hòa'},
      {id:'kitchen', icon:'bi bi-egg-fried',   label:'Bếp nấu ăn'},
      {id:'tv',      icon:'bi bi-tv',          label:'Smart TV'},
      {id:'parking', icon:'bi bi-p-circle',    label:'Bãi đỗ xe'},
      {id:'pool',    icon:'bi bi-water',       label:'Hồ bơi'},
    ],
    images:[
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop&q=60',
    ],
    reviews:[
      {id:'r1', author:'Trần Minh Anh',    date:'12/05/2025', rating:5, content:'Không gian tuyệt vời, chủ nhà rất thân thiện!'},
      {id:'r2', author:'Nguyễn Bích Ngọc', date:'03/04/2025', rating:4, content:'Phòng sạch, view đẹp. Sẽ quay lại lần sau.'},
    ],
    lat:11.9404, lng:108.4583,
    zaloLink:'https://zalo.me/0900000000',
  };
}

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  ['search-checkin','search-checkout','widget-checkin','widget-checkout','booking-checkin','booking-checkout']
    .forEach(id => { const el = document.getElementById(id); if (el) el.min = today; });

  window.addEventListener('scroll', () =>
    document.querySelector('.navbar-custom')?.classList.toggle('scrolled', scrollY > 20));

  if (location.search.includes('roomId=') && restoreCheckoutFromURL()) {
    showSection('checkout');
  } else {
    showSection('home');
  }
});
