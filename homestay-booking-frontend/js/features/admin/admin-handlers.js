import { getVal, setVal, toast } from '../../shared/utils.js';
import * as logic from './admin-logic.js';
import { renderAdminAmenities, renderAdminBankAccounts, renderAdminBookings, renderAdminHomestays, renderAdminInvoices, renderAdminPayments, renderAdminRevenue, renderAdminUsers, renderAdminVouchers, renderPendingOwners, renderPlatformStats } from './admin-render.js';

const ALL_TABS = ['users', 'owners', 'vouchers', 'stats', 'homestays', 'bookings', 'payments', 'amenities', 'bank-accounts', 'invoices'];

export async function loadUsers() {
  const search = getVal('admin-user-search');
  const role = getVal('admin-user-role-filter');
  try { renderAdminUsers(await logic.fetchAdminUsers(search, role)); } catch (e) { toast(e.message, 'danger'); }
}
export async function loadOwners() { try { renderPendingOwners(await logic.fetchPendingOwners()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadVouchers() { try { renderAdminVouchers(await logic.fetchAdminVouchers()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadStats() { try { renderPlatformStats(await logic.fetchPlatformStats()); } catch {} }
export async function loadRevenue() { try { renderAdminRevenue(await logic.fetchAdminRevenue(getVal('stats-start-date'), getVal('stats-end-date'))); } catch (e) { toast(e.message, 'danger'); } }
export async function loadHomestays() { try { renderAdminHomestays(await logic.fetchAdminHomestays()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadAllBookings() { try { renderAdminBookings(await logic.fetchAllBookings()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadAllPayments() {
  try {
    const result = await logic.fetchAllPayments();
    renderAdminPayments(Array.isArray(result) ? result : result?.data ?? []);
  } catch (e) { toast(e.message, 'danger'); }
}
export async function loadAmenities() { try { renderAdminAmenities(await logic.fetchAmenities()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadBankAccounts() { try { renderAdminBankAccounts(await logic.fetchAllBankAccounts()); } catch (e) { toast(e.message, 'danger'); } }
export async function loadInvoices() { try { renderAdminInvoices(await logic.fetchAllInvoices()); } catch (e) { toast(e.message, 'danger'); } }

export function adminTab(name) {
  ALL_TABS.forEach((t) => document.getElementById(`admin-tab-${t}`)?.classList.toggle('d-none', t !== name));
  if (name === 'users') loadUsers();
  if (name === 'owners') loadOwners();
  if (name === 'vouchers') loadVouchers();
  if (name === 'stats') loadStats();
  if (name === 'homestays') loadHomestays();
  if (name === 'bookings') loadAllBookings();
  if (name === 'payments') loadAllPayments();
  if (name === 'amenities') loadAmenities();
  if (name === 'bank-accounts') loadBankAccounts();
  if (name === 'invoices') loadInvoices();
}

function openUserFormModal(user = null) {
  setVal('user-form-id', user?.id ?? '');
  setVal('user-form-fullname', user?.fullName ?? '');
  setVal('user-form-email', user?.email ?? '');
  setVal('user-form-phone', user?.phone ?? '');
  setVal('user-form-role', user?.role?.toLowerCase() ?? 'guest');
  setVal('user-form-password', '');
  document.getElementById('user-form-title').textContent = user ? 'Sửa người dùng' : 'Tạo người dùng mới';
  document.getElementById('user-form-password-row').classList.toggle('d-none', !!user);
  new bootstrap.Modal(document.getElementById('userFormModal')).show();
}

function openAmenityFormModal(amenity = null) {
  setVal('amenity-form-id', amenity?.id ?? '');
  setVal('amenity-form-name', amenity?.name ?? '');
  setVal('amenity-form-icon', amenity?.icon ?? '');
  document.getElementById('amenity-form-title').textContent = amenity ? 'Sửa tiện nghi' : 'Thêm tiện nghi';
  new bootstrap.Modal(document.getElementById('amenityFormModal')).show();
}

export function bindAdminHandlers() {
  // Tab navigation
  document.querySelectorAll('#adminTabs .nav-link').forEach((btn, i) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('#adminTabs .nav-link').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      adminTab(ALL_TABS[i] ?? 'users');
    })
  );

  // Stats revenue search
  document.querySelector('#admin-tab-stats .btn-brand')?.addEventListener('click', loadRevenue);

  // User search
  document.getElementById('btn-admin-search-users')?.addEventListener('click', loadUsers);
  document.getElementById('admin-user-search')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadUsers(); });

  // Create user button
  document.getElementById('btn-create-user')?.addEventListener('click', () => openUserFormModal());

  // Create amenity button
  document.getElementById('btn-add-amenity')?.addEventListener('click', () => openAmenityFormModal());

  // Create voucher button
  document.querySelector('#admin-tab-vouchers .btn-brand')?.addEventListener('click', () => {
    setVal('v-code', ''); setVal('v-name', ''); setVal('v-value', ''); setVal('v-min-order', ''); setVal('v-max-uses', ''); setVal('v-start-date', ''); setVal('v-expiry-date', ''); setVal('v-description', '');
    document.getElementById('voucher-form-wrap')?.classList.remove('d-none');
  });
  document.querySelector('#voucher-form-wrap .btn-brand')?.addEventListener('click', async () => {
    try {
      await logic.saveVoucherApi({ code: getVal('v-code'), name: getVal('v-name'), type: getVal('v-type')?.toUpperCase(), discountValue: Number(getVal('v-value')), minOrderValue: Number(getVal('v-min-order')) || undefined, maxUses: Number(getVal('v-max-uses')) || undefined, startDate: getVal('v-start-date') || undefined, expiryDate: getVal('v-expiry-date'), description: getVal('v-description') || undefined });
      document.getElementById('voucher-form-wrap')?.classList.add('d-none');
      await loadVouchers();
      toast('Đã lưu voucher.', 'success');
    } catch (err) { toast(err.message, 'danger'); }
  });
  document.querySelector('#voucher-form-wrap .btn-outline-secondary')?.addEventListener('click', () => document.getElementById('voucher-form-wrap')?.classList.add('d-none'));

  // Save user form (modal)
  document.getElementById('btn-save-user-form')?.addEventListener('click', async () => {
    const id = getVal('user-form-id');
    const body = { fullName: getVal('user-form-fullname'), email: getVal('user-form-email'), phone: getVal('user-form-phone') || undefined, role: getVal('user-form-role')?.toUpperCase() };
    if (!id) body.password = getVal('user-form-password');
    try {
      if (id) { await logic.updateUser(id, body); toast('Đã cập nhật người dùng.', 'success'); }
      else { await logic.createUser(body); toast('Đã tạo người dùng mới.', 'success'); }
      bootstrap.Modal.getInstance(document.getElementById('userFormModal'))?.hide();
      await loadUsers();
    } catch (err) { toast(err.message, 'danger'); }
  });

  // Save amenity form (modal)
  document.getElementById('btn-save-amenity-form')?.addEventListener('click', async () => {
    const id = getVal('amenity-form-id');
    const body = { name: getVal('amenity-form-name'), icon: getVal('amenity-form-icon') || undefined };
    try {
      if (id) { await logic.updateAmenity(id, body); toast('Đã cập nhật tiện nghi.', 'success'); }
      else { await logic.createAmenity(body); toast('Đã thêm tiện nghi.', 'success'); }
      bootstrap.Modal.getInstance(document.getElementById('amenityFormModal'))?.hide();
      await loadAmenities();
    } catch (err) { toast(err.message, 'danger'); }
  });

  // Delegated click handler
  document.addEventListener('click', async (e) => {
    try {
      // Users
      const lock = e.target.closest('[data-lock-user]');
      if (lock) { const reason = prompt('Lý do khóa tài khoản:') || undefined; await logic.lockUser(lock.dataset.lockUser, reason); toast('Đã khóa tài khoản.', 'success'); await loadUsers(); return; }

      const unlock = e.target.closest('[data-unlock-user]');
      if (unlock) { await logic.unlockUser(unlock.dataset.unlockUser); toast('Đã mở khóa.', 'success'); await loadUsers(); return; }

      const editUser = e.target.closest('[data-edit-user]');
      if (editUser) { const user = await logic.fetchUserById(editUser.dataset.editUser); openUserFormModal(user); return; }

      const delUser = e.target.closest('[data-delete-user]');
      if (delUser && confirm('Xóa người dùng này? Thao tác không thể hoàn tác.')) { await logic.deleteUser(delUser.dataset.deleteUser); toast('Đã xóa người dùng.', 'success'); await loadUsers(); return; }

      // Owners
      const owner = e.target.closest('[data-approve-owner]');
      if (owner) { await logic.approveOwner(owner.dataset.approveOwner); toast('Đã duyệt Owner.', 'success'); await loadOwners(); return; }

      // Vouchers
      const tog = e.target.closest('[data-toggle-voucher]');
      if (tog) { await logic.toggleVoucherStatus(tog.dataset.toggleVoucher); await loadVouchers(); return; }

      const del = e.target.closest('[data-delete-voucher]');
      if (del && confirm('Xóa voucher này?')) { await logic.deleteVoucherApi(del.dataset.deleteVoucher); toast('Đã xóa voucher.', 'success'); await loadVouchers(); return; }

      // Homestays
      const approveHs = e.target.closest('[data-approve-homestay]');
      if (approveHs) { await logic.updateHomestayStatus(approveHs.dataset.approveHomestay, 'APPROVED'); toast('Đã duyệt homestay.', 'success'); await loadHomestays(); return; }

      const rejectHs = e.target.closest('[data-reject-homestay]');
      if (rejectHs) { const reason = prompt('Lý do từ chối:') || undefined; await logic.updateHomestayStatus(rejectHs.dataset.rejectHomestay, 'REJECTED', reason); toast('Đã từ chối homestay.', 'success'); await loadHomestays(); return; }

      const suspendHs = e.target.closest('[data-suspend-homestay]');
      if (suspendHs) { await logic.updateHomestayStatus(suspendHs.dataset.suspendHomestay, 'SUSPENDED'); toast('Đã tạm ngừng homestay.', 'success'); await loadHomestays(); return; }

      // Bookings
      const completeB = e.target.closest('[data-complete-booking]');
      if (completeB) { await logic.completeBooking(completeB.dataset.completeBooking); toast('Đã hoàn thành đặt phòng.', 'success'); await loadAllBookings(); return; }

      const delB = e.target.closest('[data-admin-delete-booking]');
      if (delB && confirm('Xóa đặt phòng này?')) { await logic.deleteBooking(delB.dataset.adminDeleteBooking); toast('Đã xóa.', 'success'); await loadAllBookings(); return; }

      // Payments
      const approvePayment = e.target.closest('[data-approve-payment]');
      if (approvePayment) { await logic.approvePayment(approvePayment.dataset.approvePayment); toast('Đã duyệt thanh toán.', 'success'); await loadAllPayments(); return; }

      const rejectPayment = e.target.closest('[data-reject-payment]');
      if (rejectPayment) {
        const reason = prompt('Lý do từ chối xác nhận thanh toán:') || undefined;
        await logic.rejectPayment(rejectPayment.dataset.rejectPayment, reason);
        toast('Đã từ chối thanh toán.', 'success');
        await loadAllPayments();
        return;
      }

      // Amenities
      const editAm = e.target.closest('[data-edit-amenity]');
      if (editAm) { openAmenityFormModal({ id: editAm.dataset.editAmenity, name: editAm.dataset.name, icon: editAm.dataset.icon }); return; }

      const delAm = e.target.closest('[data-delete-amenity]');
      if (delAm && confirm('Xóa tiện nghi này?')) { await logic.deleteAmenity(delAm.dataset.deleteAmenity); toast('Đã xóa tiện nghi.', 'success'); await loadAmenities(); return; }

      // Bank accounts
      const verifyBank = e.target.closest('[data-verify-bank]');
      if (verifyBank) { await logic.verifyBankAccount(verifyBank.dataset.verifyBank); toast('Đã xác minh tài khoản ngân hàng.', 'success'); await loadBankAccounts(); return; }

    } catch (err) { toast(err.message, 'danger'); }
  });
}
