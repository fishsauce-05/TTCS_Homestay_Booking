import { setVal, setText } from '../../shared/utils.js';

const ROLE_LABEL = { guest: 'Khách', user: 'Khách', owner: 'Chủ nhà', admin: 'Quản trị viên' };

export function renderProfile(user) {
  if (!user) return;
  const initials = (user.fullName ?? user.nickname ?? 'U')[0].toUpperCase();
  const avatar = document.getElementById('profile-avatar-display');
  if (avatar) {
    if (user.avatar) {
      avatar.innerHTML = `<img src="${user.avatar}" alt="" style="width:72px;height:72px;border-radius:50%;object-fit:cover;" />`;
    } else {
      avatar.textContent = initials;
    }
  }
  setText('profile-display-name', user.fullName ?? user.nickname ?? '—');
  setText('profile-display-role', ROLE_LABEL[user.role?.toLowerCase()] ?? user.role ?? '—');
  setVal('profile-fullname', user.fullName ?? '');
  setVal('profile-nickname', user.nickname ?? '');
  setVal('profile-email', user.email ?? '');
  setVal('profile-phone', user.phone ?? '');
  setVal('profile-address', user.address ?? '');
  setVal('profile-avatar', user.avatar ?? '');
}
