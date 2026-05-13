export function injectSharedComponents() {
  const base = document.body.dataset.base || (location.pathname.includes('/pages/') ? '../' : './');
  document.body.insertAdjacentHTML('afterbegin', `
<header id="main-header">
  <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
    <div class="container-xl">
      <a class="navbar-brand d-flex align-items-center gap-2" href="${base}index.html">
        <span class="logo-icon"><i class="bi bi-house-heart-fill"></i></span>
        <span class="logo-text">Fishsauce Homestay</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav ms-auto align-items-center gap-1">
          <li class="nav-item"><a class="nav-link nav-pill" href="${base}index.html"><i class="bi bi-house me-1"></i>Trang chủ</a></li>
          <li class="nav-item"><a class="nav-link nav-pill" href="${base}pages/rooms.html"><i class="bi bi-grid me-1"></i>Homestay</a></li>
          <li class="nav-item d-none d-lg-block"><div class="nav-divider"></div></li>
          <li class="nav-item" id="nav-guest-section"><a class="nav-link nav-pill" href="#" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="bi bi-person me-1"></i>Đăng nhập</a></li>
          <li class="nav-item" id="nav-register-btn"><a class="btn btn-brand-outline btn-sm px-3" href="#" data-bs-toggle="modal" data-bs-target="#registerModal">Đăng ký</a></li>
          <li class="nav-item dropdown d-none" id="nav-user-section">
            <a class="nav-link dropdown-toggle user-avatar-btn" href="#" data-bs-toggle="dropdown"><span class="user-avatar-circle" id="nav-user-avatar">A</span><span id="nav-username">Người dùng</span></a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-brand">
              <li><a class="dropdown-item" href="${base}pages/profile.html"><i class="bi bi-person-circle me-2"></i>Hồ sơ cá nhân</a></li>
              <li><a class="dropdown-item" href="${base}pages/my-bookings.html"><i class="bi bi-calendar-check me-2"></i>Lịch đặt phòng</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item text-danger" type="button" id="btn-logout"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
            </ul>
          </li>
          <li class="nav-item d-none" id="nav-admin-section"><a class="btn btn-sm btn-brand px-3" href="${base}pages/admin.html"><i class="bi bi-shield-lock me-1"></i>Admin</a></li>
          <li class="nav-item d-none" id="nav-owner-section"><a class="btn btn-sm btn-brand px-3" href="${base}pages/owner.html"><i class="bi bi-speedometer2 me-1"></i>Quản lý</a></li>
        </ul>
      </div>
    </div>
  </nav>
</header>`);

  document.body.insertAdjacentHTML('beforeend', `
<footer class="site-footer mt-5">
  <div class="container-xl py-5"><div class="row g-4">
    <div class="col-lg-5"><div class="footer-brand mb-3"><span class="logo-icon me-2"><i class="bi bi-house-heart-fill"></i></span><span class="logo-text">Fishsauce Homestay</span></div><p class="footer-desc">Nền tảng đặt homestay dành cho những chuyến đi ấm áp và đáng nhớ.</p></div>
    <div class="col-6 col-lg-3"><h6 class="footer-heading">Khám phá</h6><ul class="footer-links"><li><a href="${base}index.html">Trang chủ</a></li><li><a href="${base}pages/rooms.html">Homestay</a></li></ul></div>
    <div class="col-6 col-lg-4"><h6 class="footer-heading">Hỗ trợ</h6><ul class="footer-links"><li><a href="#">Điều khoản</a></li><li><a href="#">Chính sách riêng tư</a></li></ul></div>
  </div><hr class="footer-divider" /><p class="footer-copy mb-0">© Fishsauce Homestay</p></div>
</footer>

<div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content modal-brand"><div class="modal-header border-0 pb-0"><h5 class="modal-title">Đăng nhập</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body pt-2">
  <div class="mb-3"><label class="form-label" for="login-email">Email</label><input type="email" id="login-email" class="form-control form-control-brand" placeholder="fishsauce@gmail.com" /></div>
  <div class="mb-3"><label class="form-label" for="login-password">Mật khẩu</label><div class="input-group"><input type="password" id="login-password" class="form-control form-control-brand" placeholder="••••••••" /><button class="btn btn-outline-secondary" type="button" data-toggle-password="login-password"><i class="bi bi-eye"></i></button></div></div>
  <div class="alert alert-danger d-none py-2 small" id="login-error-msg"></div>
  <button class="btn btn-brand w-100" id="btn-login-submit"><span class="spinner-border spinner-border-sm d-none me-1"></span>Đăng nhập</button>
</div></div></div></div>

<div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content modal-brand"><div class="modal-header border-0 pb-0"><h5 class="modal-title">Tạo tài khoản</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body pt-2">
  <div class="row g-3"><div class="col-md-6"><label class="form-label" for="reg-fullname">Họ và tên</label><input id="reg-fullname" class="form-control form-control-brand" placeholder="Nguyễn Văn A" /></div><div class="col-md-6"><label class="form-label" for="reg-nickname">Tên hiển thị</label><input id="reg-nickname" class="form-control form-control-brand" placeholder="Tên hiển thị" /></div><div class="col-md-6"><label class="form-label" for="reg-phone">Số điện thoại</label><input id="reg-phone" class="form-control form-control-brand" placeholder="0123456789" /></div><div class="col-md-6"><label class="form-label" for="reg-email">Email</label><input type="email" id="reg-email" class="form-control form-control-brand" placeholder="fishsauce@gmail.com" /></div><div class="col-md-6"><label class="form-label" for="reg-password">Mật khẩu</label><div class="input-group"><input type="password" id="reg-password" class="form-control form-control-brand" placeholder="••••••••" /><button class="btn btn-outline-secondary" type="button" data-toggle-password="reg-password"><i class="bi bi-eye"></i></button></div></div><div class="col-md-6"><label class="form-label" for="reg-password-confirm">Xác nhận mật khẩu</label><div class="input-group"><input type="password" id="reg-password-confirm" class="form-control form-control-brand" placeholder="••••••••" /><button class="btn btn-outline-secondary" type="button" data-toggle-password="reg-password-confirm"><i class="bi bi-eye"></i></button></div></div><div class="col-12"><div class="form-check"><input class="form-check-input check-brand" type="checkbox" id="reg-agree-terms"><label class="form-check-label small" for="reg-agree-terms">Tôi đồng ý với điều khoản sử dụng</label></div></div></div>
  <div class="alert alert-danger d-none py-2 small mt-3" id="register-error-msg"></div><div class="alert alert-success d-none py-2 small mt-3" id="register-success-msg"></div>
  <button class="btn btn-brand w-100 mt-3" id="btn-register-submit"><span class="spinner-border spinner-border-sm d-none me-1"></span>Tạo tài khoản</button>
</div></div></div></div>

<div class="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container"><div id="app-toast" class="toast align-items-center text-white border-0" role="alert"><div class="d-flex"><div class="toast-body" id="toast-message"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div></div>`);
}
