/**
 * nailArtService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Data layer untuk contoh nail art yang dipakai engine generator kuku
 * (YOLOv8 + MediaPipe).
 *
 * • Admin page (/admin/nail-art) melakukan CRUD penuh (tambah, edit, toggle,
 *   hapus) beserta upload gambar.
 * • Endpoint Laravel: GET/POST/PUT/PATCH/DELETE /api/admin/nail-art-examples
 * • Tetap bisa dipakai saat backend mati lewat fallback localStorage.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const LS_KEY = 'gsu_nail_art_examples_v1';

const SEED_EXAMPLES = [
    { id: 1, slug: 'contoh_blush_jelly', name: 'Contoh Korean Blush Jelly', category: 'Trending Korean', design_id: 'blush_jelly', description: 'Contoh hasil gradasi jelly pink transparan dengan glitter halus.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 1 },
    { id: 2, slug: 'contoh_french_gold', name: 'Contoh French Glam Gold', category: 'Elegant Luxury', design_id: 'french_gold', description: 'Contoh French tip putih dengan aksen foil emas metalik.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 2 },
    { id: 3, slug: 'contoh_aurora_glaze', name: 'Contoh Pastel Aurora Glaze', category: 'Mermaid / Glaze', design_id: 'aurora_glaze', description: 'Contoh kilau aurora lilac dan mint pearlescent.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 3 },
    { id: 4, slug: 'contoh_sakura_floral', name: 'Contoh Cherry Blossom Floral', category: 'Cute & Kawaii', design_id: 'sakura_floral', description: 'Contoh motif kelopak sakura dengan aksen putik emas.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 4 },
    { id: 5, slug: 'contoh_starry_night', name: 'Contoh Celestial Starry Night', category: 'Mystic Galaxy', design_id: 'starry_night', description: 'Contoh nuansa biru malam dengan rasi bintang perak.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 5 },
    { id: 6, slug: 'contoh_ruby_velvet', name: 'Contoh Ruby Velvet Glamour', category: 'Bold Luxury', design_id: 'ruby_velvet', description: 'Contoh warna marun velvet dengan garis cat-eye 3D.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 6 },
    { id: 7, slug: 'contoh_cute_doodle', name: 'Contoh Pastel Y2K Mini Doodle', category: 'Cute & Kawaii', design_id: 'cute_doodle', description: 'Contoh doodle pastel lucu di atas dasar butter cream.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 7 },
    { id: 8, slug: 'contoh_rose_foil', name: 'Contoh Minimalist Rose Gold Foil', category: 'Chic Minimalist', design_id: 'rose_foil', description: 'Contoh nude susu dengan serpihan rose gold foil.', engine: 'YOLOv8 + MediaPipe', image_url: null, is_active: true, sort_order: 8 },
];

function lsRead() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (_) {}
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_EXAMPLES));
    return SEED_EXAMPLES;
}

function lsWrite(examples) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(examples));
        window.dispatchEvent(new Event('gsu_nail_art_examples_updated'));
    } catch (e) {
        console.error('Error writing nail art examples to localStorage', e);
    }
}

function toBool(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
}

function appendPayload(formData, payload) {
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
        } else {
            formData.append(key, value);
        }
    });
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

let backendCheckCache = { alive: false, lastCheck: 0 };
async function isBackendAlive() {
    const now = Date.now();
    if (now - backendCheckCache.lastCheck < 10000) {
        return backendCheckCache.alive;
    }
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1200);
        const res = await fetch(`${BASE_URL}/api/nail-art-examples?limit=1`, {
            headers: { Accept: 'application/json' },
            signal: ctrl.signal,
        });
        clearTimeout(timer);
        backendCheckCache = { alive: res.ok, lastCheck: now };
        return res.ok;
    } catch (_) {
        backendCheckCache = { alive: false, lastCheck: now };
        return false;
    }
}

function extractList(data) {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    return [];
}

/**
 * Fetch active examples for public/engine consumption.
 */
export async function fetchPublicExamples() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/nail-art-examples`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) return extractList(data);
        } catch (_) {}
    }
    return lsRead().filter((example) => example.is_active !== false);
}

/**
 * Fetch all examples for admin panel.
 */
export async function fetchAllExamples() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/nail-art-examples`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) return extractList(data);
        } catch (_) {}
    }
    return lsRead();
}

/**
 * Create a new example (Admin). `file` bersifat opsional.
 */
export async function createExample(payload, file = null) {
    const alive = await isBackendAlive();

    if (alive) {
        try {
            const formData = new FormData();
            appendPayload(formData, payload);
            if (file) formData.append('image', file);

            const res = await fetch(`${BASE_URL}/api/admin/nail-art-examples`, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Gagal menyimpan contoh nail art.');
            }
            return data.data;
        } catch (err) {
            console.error('[NailArtService] createExample error:', err);
            throw err;
        }
    }

    // Offline fallback
    const imageUrl = file ? await fileToDataUrl(file) : null;
    const newExample = {
        id: Date.now(),
        ...payload,
        is_active: toBool(payload.is_active ?? true),
        sort_order: Number(payload.sort_order) || 0,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
    };
    lsWrite([newExample, ...lsRead()]);
    return newExample;
}

/**
 * Update an existing example (Admin). `file` opsional.
 */
export async function updateExample(id, payload, file = null) {
    const alive = await isBackendAlive();

    if (alive) {
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            appendPayload(formData, payload);
            if (file) formData.append('image', file);

            const res = await fetch(`${BASE_URL}/api/admin/nail-art-examples/${id}`, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Gagal memperbarui contoh nail art.');
            }
            return data.data;
        } catch (err) {
            console.error('[NailArtService] updateExample error:', err);
            throw err;
        }
    }

    // Offline fallback
    const imageUrl = file ? await fileToDataUrl(file) : undefined;
    const all = lsRead();
    let updated = null;
    const next = all.map((example) => {
        if (String(example.id) === String(id)) {
            updated = {
                ...example,
                ...payload,
                is_active: toBool(payload.is_active ?? example.is_active),
                sort_order: Number(payload.sort_order) || 0,
                ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
            };
            return updated;
        }
        return example;
    });
    lsWrite(next);
    return updated;
}

/**
 * Toggle visibility of an example (Admin).
 */
export async function toggleExampleVisibility(id) {
    const alive = await isBackendAlive();

    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/nail-art-examples/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (res.ok && data.success) return data.data?.is_active;
        } catch (_) {}
    }

    // Offline fallback
    const all = lsRead();
    let nextActive = false;
    const next = all.map((example) => {
        if (String(example.id) === String(id)) {
            nextActive = !example.is_active;
            return { ...example, is_active: nextActive };
        }
        return example;
    });
    lsWrite(next);
    return nextActive;
}

/**
 * Delete an example (Admin).
 */
export async function deleteExample(id) {
    const alive = await isBackendAlive();

    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/nail-art-examples/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (res.ok && data.success) return true;
            throw new Error(data.message || 'Gagal menghapus contoh nail art.');
        } catch (err) {
            console.error('[NailArtService] deleteExample error:', err);
            throw err;
        }
    }

    // Offline fallback
    lsWrite(lsRead().filter((example) => String(example.id) !== String(id)));
    return true;
}
