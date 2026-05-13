import { apiPost, clearToken, getCurrentUser, getToken, setCurrentUser, setToken } from '../core/api.js';
import { getVal, setBtnLoading, setText, toast } from './utils.js';

export async function handleLogin() {
  setBtnLoading('btn-login-submit', true);
  document.getElementById('login-error-msg')?.classList.add('d-none');
  try {
    const data = await apiPost('/auth/login', { email: getVal('login-email'), password: getVal('login-password') });
    setToken(data.accessToken ?? data.token);
    setCurrentUser(data.user);
    onLoginSuccess(data.user);
    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    toast('Đăng nhập thành công!', 'success');
  } catch (err) {
    setText('login-error-msg', err.message || 'Đăng nhập thất bại.');
    document.getElementById('login-error-msg')?.classList.remove('d-none');
  } finally { setBtnLoading('btn-login-submit', false); }
}

export async function handleRegister() {
  if (getVal('reg-password') !== getVal('reg-password-confirm')) { toast('Mật khẩu xác nhận không khớp.', 'warning'); return; }
  if (!document.getElementById('reg-agree-terms')?.checked) { toast('Bạn cần đồng ý điều khoản sử dụng.', 'warning'); return; }
  setBtnLoading('btn-register-submit', true);
  try {
    await apiPost('/auth/register', { fullName: getVal('reg-fullname'), nickname: getVal('reg-nickname'), phone: getVal('reg-phone'), email: getVal('reg-email'), password: getVal('reg-password') });
    document.getElementById('register-success-msg')?.classList.remove('d-none');
    setText('register-success-msg', 'Đăng ký thành công. Bạn có thể đăng nhập ngay.');
  } catch (err) {
    setText('register-error-msg', err.message || 'Đăng ký thất bại.');
    document.getElementById('register-error-msg')?.classList.remove('d-none');
  } finally { setBtnLoading('btn-register-submit', false); }
}

export function onLoginSuccess(user) {
  document.getElementById('nav-guest-section')?.classList.add('d-none');
  document.getElementById('nav-register-btn')?.classList.add('d-none');
  document.getElementById('nav-user-section')?.classList.remove('d-none');
  setText('nav-username', user?.fullName ?? user?.email ?? 'Người dùng');
  setText('nav-user-avatar', (user?.fullName ?? user?.email ?? 'A').trim()[0]?.toUpperCase());
  document.getElementById('nav-admin-section')?.classList.toggle('d-none', user?.role !== 'admin');
  document.getElementById('nav-owner-section')?.classList.toggle('d-none', !['owner', 'admin'].includes(user?.role));
}

export function handleLogout() {
  clearToken();
  location.href = location.pathname.includes('/pages/') ? '../index.html' : './index.html';
}

export function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

export function checkAuthState() {
  const user = getCurrentUser();
  if (user && getToken()) onLoginSuccess(user);
}

export function bindAuthHandlers() {
  document.getElementById('btn-login-submit')?.addEventListener('click', handleLogin);
  document.getElementById('btn-register-submit')?.addEventListener('click', handleRegister);
  document.getElementById('btn-logout')?.addEventListener('click', handleLogout);
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => btn.addEventListener('click', () => togglePasswordVisibility(btn.dataset.togglePassword)));
}

export function switchLoginType() {}
export function switchRegisterType() {}
