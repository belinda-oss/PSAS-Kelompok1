/**
 * servicesService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Data layer layanan Shofi Eyelash — terhubung langsung ke tabel `services`.
 *
 * • Public page (/shofi-eyelash) membaca layanan dengan is_visible = true
 *   dari GET /api/services.
 * • Admin page (/admin/layanan) melakukan CRUD penuh lewat
 *   GET/POST/PUT/PATCH/DELETE /api/admin/services (token Sanctum).
 * • Gambar diunggah sebagai file (multipart/form-data) dan disimpan backend
 *   sebagai data URL Base64 di kolom `image`.
 * • Tidak ada data dummy / seeding / fallback localStorage.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { adminFetch } from './adminAuth';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const UPDATE_EVENT = 'gsu_services_updated';

// Bersihkan cache dummy lama dari versi localStorage sebelumnya.
try {
    localStorage.removeItem('gsu_services_v1');
} catch (_) {}

function notifyUpdated() {
    window.dispatchEvent(new Event(UPDATE_EVENT));
}

async function readJson(res) {
    try {
        return await res.json();
    } catch (_) {
        return {};
    }
}

function extractList(data) {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.data)) return data.data.data;
    return [];
}

async function ensureOk(res, fallbackMessage) {
    const data = await readJson(res);
    if (!res.ok || !data.success) {
        const error = new Error(data.message || fallbackMessage);
        error.status = res.status;
        error.errors = data.errors || null;
        throw error;
    }
    return data;
}

function buildFormData(payload, file) {
    const formData = new FormData();
    ['name', 'price', 'description'].forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
            formData.append(key, payload[key]);
        }
    });
    if (typeof payload.is_visible === 'boolean') {
        formData.append('is_visible', payload.is_visible ? '1' : '0');
    }
    if (file) formData.append('image', file);
    return formData;
}

/**
 * Layanan yang tampil di website publik (is_visible = true).
 */
export async function fetchVisibleServices() {
    const res = await fetch(`${BASE_URL}/api/services`, {
        headers: { Accept: 'application/json' },
    });
    const data = await ensureOk(res, 'Gagal memuat layanan.');
    return extractList(data).filter((service) => service.is_visible !== false);
}

// Alias untuk kompatibilitas dengan import lama.
export const fetchActiveServices = fetchVisibleServices;

/**
 * Semua layanan (tampil + disembunyikan) untuk panel admin.
 */
export async function fetchAllServices() {
    const res = await adminFetch('/api/admin/services');
    const data = await ensureOk(res, 'Gagal memuat daftar layanan.');
    return extractList(data);
}

/**
 * Tambah layanan baru. `file` (gambar) wajib.
 */
export async function createService(payload, file) {
    const res = await adminFetch('/api/admin/services', {
        method: 'POST',
        body: buildFormData({ is_visible: true, ...payload }, file),
    });
    const data = await ensureOk(res, 'Gagal menyimpan layanan.');
    notifyUpdated();
    return data.data;
}

/**
 * Perbarui layanan. `file` opsional — bila kosong, gambar lama dipertahankan.
 * Memakai POST + _method=PUT karena PHP tidak mem-parse multipart pada PUT.
 */
export async function updateService(id, payload, file = null) {
    const formData = buildFormData(payload, file);
    formData.append('_method', 'PUT');

    const res = await adminFetch(`/api/admin/services/${id}`, {
        method: 'POST',
        body: formData,
    });
    const data = await ensureOk(res, 'Gagal memperbarui layanan.');
    notifyUpdated();
    return data.data;
}

/**
 * Toggle "Tampil di Web" / "Sembunyikan". Mengembalikan status is_visible baru.
 */
export async function toggleServiceVisibility(id, isVisible) {
    const body = typeof isVisible === 'boolean' ? { is_visible: isVisible } : {};
    const res = await adminFetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await ensureOk(res, 'Gagal mengubah status layanan.');
    notifyUpdated();
    return Boolean(data.data?.is_visible);
}

/**
 * Hapus layanan.
 */
export async function deleteService(id) {
    const res = await adminFetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
    });
    await ensureOk(res, 'Gagal menghapus layanan.');
    notifyUpdated();
    return true;
}
