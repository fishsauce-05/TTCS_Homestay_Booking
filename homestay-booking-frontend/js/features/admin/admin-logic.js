import { apiDelete, apiGet, apiPatch, apiPost } from '../../core/api.js';

// Users
export const fetchAdminUsers = (search = '', role = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (role) params.set('role', role);
  const qs = params.toString();
  return apiGet(`/users${qs ? '?' + qs : ''}`);
};
export const fetchUserById = (id) => apiGet(`/users/${id}`);
export const createUser = (body) => apiPost('/users', body);
export const updateUser = (id, body) => apiPatch(`/users/${id}`, body);
export const deleteUser = (id) => apiDelete(`/users/${id}`);
export const fetchPendingOwners = async () => (await apiGet('/users?role=owner') ?? []).filter((u) => !u.isEmailVerified && !u.isLocked);
export const lockUser = (id, reason) => apiPatch(`/users/${id}/lock`, { reason });
export const unlockUser = (id) => apiPatch(`/users/${id}/unlock`, {});
export const approveOwner = (id) => apiPatch(`/users/${id}/approve-owner`, {});

// Vouchers
export const fetchAdminVouchers = () => apiGet('/vouchers');
export const saveVoucherApi = (body, id) => id ? apiPatch(`/vouchers/${id}`, body) : apiPost('/vouchers', body);
export const toggleVoucherStatus = (id) => apiPatch(`/vouchers/${id}/toggle-status`, {});
export const deleteVoucherApi = (id) => apiDelete(`/vouchers/${id}`);

// Stats
export const fetchPlatformStats = () => apiGet('/stats/summary');
export const fetchAdminRevenue = (startDate, endDate) => apiGet(`/stats/revenue/homestay?startDate=${startDate}&endDate=${endDate}`);

// Homestays
export const fetchAdminHomestays = () => apiGet('/homestays');
export const updateHomestayStatus = (id, status, rejectionReason) =>
  apiPatch(`/homestays/${id}/status`, { status, rejectionReason });

// Bookings
export const fetchAllBookings = () => apiGet('/bookings/all');
export const completeBooking = (id) => apiPatch(`/bookings/${id}/complete`, {});
export const deleteBooking = (id) => apiDelete(`/bookings/${id}`);
export const updateBookingStatus = (id, status) => apiPatch(`/bookings/${id}/status`, { status });

// Payments
export const fetchAllPayments = (skip = 0, take = 50) => apiGet(`/payments?skip=${skip}&take=${take}`);
export const approvePayment = (id) => apiPatch(`/payments/${id}/approve`, {});
export const rejectPayment = (id, reason) => apiPatch(`/payments/${id}/reject`, { reason });

// Amenities
export const fetchAmenities = () => apiGet('/amenity');
export const createAmenity = (body) => apiPost('/amenity', body);
export const updateAmenity = (id, body) => apiPatch(`/amenity/${id}`, body);
export const deleteAmenity = (id) => apiDelete(`/amenity/${id}`);

// Bank accounts
export const fetchAllBankAccounts = () => apiGet('/bank-accounts');
export const verifyBankAccount = (id) => apiPatch(`/bank-accounts/${id}/verify`, {});

// Invoices
export const fetchAllInvoices = () => apiGet('/invoices');
