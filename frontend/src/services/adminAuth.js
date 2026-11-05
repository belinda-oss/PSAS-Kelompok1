/**
 * adminAuth.js
 * -----------------------------------------------------------------------------
 * Sesi autentikasi panel admin berbasis token Sanctum.
 *
 * - Login menukar email + kata sandi menjadi token di /api/admin/login.
 * - Token disimpan di localStorage (jika "ingat sesi") atau sessionStorage.
 * - Semua request admin mengirim header Authorization: Bearer <token>.
 * - Token lama otomatis dicabut server ketika login ulang / ganti kata sandi.
 * -----------------------------------------------------------------------------
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const TOKEN_KEY = 'gsu_admin_token';
const USER_KEY = 'gsu_admin_user';
const LEGACY_KEY = 'admin_authenticated';

function readValue(key) {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? null;
}

function readJson(key) {
    const raw = readValue(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
}

export function getAdminToken() {
    return readValue(TOKEN_KEY);
}

export function getAdminUser() {
    return readJson(USER_KEY);
}

export function isAdminAuthenticated() {
    return Boolean(getAdminToken());
}

export function clearAdminSession() {
    [localStorage, sessionStorage].forEach((storage) => {
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(USER_KEY);
    });
    localStorage.removeItem(LEGACY_KEY);
}

function persistSession({ token, user, remember }) {
    clearAdminSession();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function updateStoredAdminUser(user) {
    if (!user) return;
    const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    if (storage.getItem(TOKEN_KEY)) {
        storage.setItem(USER_KEY, JSON.stringify(user));
    }
}

export function adminAuthHeaders(extra = {}) {
    const token = getAdminToken();
    return {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

export function adminFetch(path, options = {}) {
    const headers = adminAuthHeaders(options.headers || {});

    return fetch(`${BASE_URL}${path}`, { ...options, headers }).then((response) => {
        if (response.status === 401 || response.status === 403) {
            clearAdminSession();
            window.dispatchEvent(new Event('gsu_admin_unauthorized'));
        }

        return response;
    });
}

async function readJsonResponse(response) {
    try {
        return await response.json();
    } catch (_) {
        return {};
    }
}

function buildError(response, data) {
    let message = data?.message;

    if (!message) {
        if (response.status === 429) {
            message = 'Terlalu banyak percobaan masuk. Coba lagi dalam 1 menit.';
        } else if (response.status === 401 || response.status === 403) {
            message = 'Sesi admin tidak valid. Silakan masuk kembali.';
        } else if (response.status >= 500) {
            message = 'Server sedang bermasalah. Coba lagi sebentar.';
        } else {
            message = 'Tidak dapat memproses permintaan.';
        }
    }

    const error = new Error(message);
    error.status = response.status;
    error.errors = data?.errors || null;
    return error;
}

export async function loginAdmin({ email, password, remember = true }) {
    let response;

    try {
        response = await fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ email, password, remember }),
        });
    } catch (_) {
        throw new Error('Tidak dapat terhubung ke server admin. Pastikan backend berjalan.');
    }

    const data = await readJsonResponse(response);

    if (!response.ok || !data.success || !data.token) {
        throw buildError(response, data);
    }

    persistSession({ token: data.token, user: data.user, remember });
    return data.user;
}

export async function fetchAdminSession() {
    const token = getAdminToken();
    if (!token) return null;

    let response;

    try {
        response = await adminFetch('/api/admin/me');
    } catch (_) {
        // Server tidak terjangkau: jangan anggap sesi valid.
        return null;
    }

    if (!response.ok) {
        clearAdminSession();
        return null;
    }

    const data = await readJsonResponse(response);
    if (!data.success || !data.user) {
        clearAdminSession();
        return null;
    }

    updateStoredAdminUser(data.user);
    return data.user;
}

export async function logoutAdmin() {
    if (getAdminToken()) {
        try {
            await adminFetch('/api/admin/logout', { method: 'POST' });
        } catch (_) {
            // Sesi lokal tetap dibersihkan meskipun server tidak terjangkau.
        }
    }

    clearAdminSession();
}

export async function changeAdminPassword({ currentPassword, password, passwordConfirmation }) {
    let response;

    try {
        response = await adminFetch('/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });
    } catch (_) {
        throw new Error('Tidak dapat terhubung ke server admin.');
    }

    const data = await readJsonResponse(response);

    if (!response.ok || !data.success) {
        throw buildError(response, data);
    }

    return data;
}

export default {
    loginAdmin,
    logoutAdmin,
    fetchAdminSession,
    changeAdminPassword,
    getAdminToken,
    getAdminUser,
    isAdminAuthenticated,
    clearAdminSession,
    adminAuthHeaders,
    adminFetch,
};
