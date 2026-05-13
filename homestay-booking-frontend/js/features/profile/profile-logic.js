import { apiGet, apiPatch } from '../../core/api.js';

export const fetchMyProfile = () => apiGet('/users/profile/me');

export const updateMyProfile = (body) => apiPatch('/users/profile/me', body);

export const changePassword = (body) => apiPatch('/users/change-password', body);
