/**
 * servicesService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared services data layer — dual-mode (REST API + localStorage real-time bridge)
 *
 * • Public page (/shofi-eyelash) fetches active services (is_active: true).
 * • Admin page (/admin/layanan) performs full CRUD (Create, Read, Update, Delete)
 *   and toggles visibility (is_active / status).
 * • Works immediately with offline/localStorage fallback, and syncs with Laravel
 *   API (GET /api/services, POST, PUT, PATCH, DELETE) when available.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const LS_KEY = 'gsu_services_v1';

// Seed initial services matching Shofi Eyelash catalogue
const SEED_SERVICES = [
    {
        id: 1,
        title: 'Eyebrow & Lip Embroidery',
        price: 'From $150',
        description: 'Wake up effortlessly beautiful with our semi-permanent makeup solutions. Precision techniques for natural-looking enhancement.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        status: 'Aktif',
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 2,
        title: 'Eyelash Extension',
        price: 'From $80',
        description: 'Customized lash designs tailored to your eye shape. Choose from classic, volume, or hybrid sets for the perfect flutter.',
        image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
        status: 'Aktif',
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 3,
        title: 'Nail Art (Motif, Plain, 3D)',
        price: 'From $45',
        description: 'Express your style with our premium manicure services. Featuring intricate motifs, classic solids, and stunning 3D designs.',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        status: 'Aktif',
        is_active: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 4,
        title: 'Foot Spa',
        price: 'From $60',
        description: 'A rejuvenating retreat for your feet. Includes deep exfoliation, soothing massage, and a restorative hydrating mask.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        status: 'Aktif',
        is_active: true,
        created_at: new Date().toISOString(),
    },
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
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_SERVICES));
    return SEED_SERVICES;
}

function lsWrite(services) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(services));
        window.dispatchEvent(new Event('gsu_services_updated'));
    } catch (e) {
        console.error('Error writing services to localStorage', e);
    }
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
        const res = await fetch(`${BASE_URL}/api/services?active=true&limit=1`, {
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

/**
 * Fetch active services for public page (/shofi-eyelash)
 */
export async function fetchActiveServices() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/services?active=true`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                const list = Array.isArray(data.data) ? data.data : (data.data?.data ?? []);
                return list;
            }
        } catch (_) {}
    }
    return lsRead().filter(s => s.is_active === true || s.status === 'Aktif');
}

/**
 * Fetch all services for admin panel (/admin/layanan)
 */
export async function fetchAllServices() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/services`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                const list = Array.isArray(data.data) ? data.data : (data.data?.data ?? []);
                return list;
            }
        } catch (_) {}
    }
    return lsRead();
}

/**
 * Create a new service (Admin)
 */
export async function createService(serviceData) {
    const newService = {
        id: Date.now(),
        title: serviceData.title,
        price: serviceData.price,
        description: serviceData.description,
        image: serviceData.image || 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
        status: serviceData.status || 'Aktif',
        is_active: serviceData.status === 'Aktif',
        created_at: new Date().toISOString(),
    };

    const all = lsRead();
    lsWrite([newService, ...all]);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(newService),
            });
        } catch (_) {}
    }

    return newService;
}

/**
 * Update an existing service (Admin)
 */
export async function updateService(id, updatedData) {
    const all = lsRead();
    const updated = all.map(s => {
        if (String(s.id) === String(id)) {
            const is_active = updatedData.is_active !== undefined 
                ? updatedData.is_active 
                : (updatedData.status ? updatedData.status === 'Aktif' : s.is_active);
            const status = updatedData.status || (is_active ? 'Aktif' : 'Nonaktif');
            return { ...s, ...updatedData, is_active, status };
        }
        return s;
    });
    lsWrite(updated);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(updatedData),
            });
        } catch (_) {}
    }
}

/**
 * Toggle service visibility (Admin)
 */
export async function toggleServiceVisibility(id) {
    const all = lsRead();
    let nextActive = false;
    const updated = all.map(s => {
        if (String(s.id) === String(id)) {
            nextActive = !s.is_active;
            return {
                ...s,
                is_active: nextActive,
                status: nextActive ? 'Aktif' : 'Nonaktif',
            };
        }
        return s;
    });
    lsWrite(updated);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/services/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ is_active: nextActive }),
            });
        } catch (_) {}
    }

    return nextActive;
}

/**
 * Delete a service (Admin)
 */
export async function deleteService(id) {
    const all = lsRead();
    const filtered = all.filter(s => String(s.id) !== String(id));
    lsWrite(filtered);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/services/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
        } catch (_) {}
    }
}
