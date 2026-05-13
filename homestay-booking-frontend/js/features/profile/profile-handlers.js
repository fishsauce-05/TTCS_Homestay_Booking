import { getVal, setBtnLoading, toast } from '../../shared/utils.js';
import { changePassword, fetchMyProfile, updateMyProfile } from './profile-logic.js';
import { renderProfile } from './profile-render.js';

export async function loadProfile() {
  try {
    const user = await fetchMyProfile();
    renderProfile(user);
  } catch (e) {
    toast(e.message, 'danger');
  }
}

export function profileTab(name) {
  ['info', 'password'].forEach((t) =>
    document.getElementById(`profile-tab-${t}`)?.classList.toggle('d-none', t !== name)
  );
}

export function bindProfileHandlers() {
  document.querySelectorAll('#profileTabs .nav-link').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#profileTabs .nav-link').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      profileTab(['info', 'password'][i]);
    });
  });

  document.getElementById('btn-save-profile')?.addEventListener('click', async () => {
    setBtnLoading('btn-save-profile', true);
    try {
      const body = {
        fullName: getVal('profile-fullname') || undefined,
        phone: getVal('profile-phone') || undefined,
        address: getVal('profile-address') || undefined,
        avatar: getVal('profile-avatar') || undefined,
      };
      await updateMyProfile(body);
      toast('Đã cập nhật hồ sơ thành công!', 'success');
      await loadProfile();
    } catch (e) {
      toast(e.message, 'danger');
    } finally {
      setBtnLoading('btn-save-profile', false);
    }
  });

  document.getElementById('btn-change-password')?.addEventListener('click', async () => {
    const currentPassword = getVal('pw-current');
    const newPassword = getVal('pw-new');
    const passwordConfirm = getVal('pw-confirm');
    if (!currentPassword || !newPassword || !passwordConfirm) {
      toast('Vui lòng điền đầy đủ các trường mật khẩu.', 'warning');
      return;
    }
    if (newPassword !== passwordConfirm) {
      toast('Mật khẩu mới và xác nhận không khớp.', 'warning');
      return;
    }
    if (newPassword.length < 8) {
      toast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'warning');
      return;
    }
    setBtnLoading('btn-change-password', true);
    try {
      await changePassword({ currentPassword, newPassword, passwordConfirm });
      toast('Đã đổi mật khẩu thành công!', 'success');
      ['pw-current', 'pw-new', 'pw-confirm'].forEach((id) => { const el = document.getElementById(id); if (el) el.value = ''; });
    } catch (e) {
      toast(e.message, 'danger');
    } finally {
      setBtnLoading('btn-change-password', false);
    }
  });

  // Toggle password visibility
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle-password]');
    if (!btn) return;
    const input = document.getElementById(btn.dataset.togglePassword);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.querySelector('i')?.classList.toggle('bi-eye', !isPassword);
    btn.querySelector('i')?.classList.toggle('bi-eye-slash', isPassword);
  });
}
