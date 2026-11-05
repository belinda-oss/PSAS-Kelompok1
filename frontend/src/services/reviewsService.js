/**
 * reviewsService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared reviews data layer — database-first (Laravel API) with localStorage
 * fallback so the UI keeps working when the backend is offline.
 *
 * • Public page (/shofi-eyelash) submits reviews with status: 'pending'.
 * • Admin page (/admin/ulasan) sees all reviews, including pending ones.
 * • Admin approves ('approved'), hides ('hidden'), or deletes reviews.
 * • Only 'approved' reviews are visible on the public page.
 * • Real-time event synchronization keeps all tabs and pages in sync.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { adminFetch } from './adminAuth';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const LS_KEY = 'gsu_reviews_v1';

// Seed initial approved reviews (fallback only, used when backend is offline)
const SEED_REVIEWS = [
    { 
        id: 1, 
        name: 'Sarah Wijaya',   
        rating: 5, 
        comment: 'Hasilnya sangat natural dan tahan lama. Teknisi sangat profesional dan ramah!',       
        status: 'approved', 
        created_at: new Date(Date.now() - 2  * 86400_000).toISOString() 
    },
    { 
        id: 2, 
        name: 'Amanda Putri',   
        rating: 5, 
        comment: 'Tempatnya sangat nyaman dan bersih. Sangat merekomendasikan Shofi Eyelash!',           
        status: 'approved', 
        created_at: new Date(Date.now() - 7  * 86400_000).toISOString() 
    },
    { 
        id: 3, 
        name: 'Rina Kartika',   
        rating: 5, 
        comment: 'Volume set-nya juara! Mata jadi terlihat lebih hidup tapi tetap ringan.',              
        status: 'approved', 
        created_at: new Date(Date.now() - 14 * 86400_000).toISOString() 
    },
    { 
        id: 4, 
        name: 'Dewi Rahayu',    
        rating: 4, 
        comment: 'Nail art-nya rapi dan detail, hasilnya melebihi ekspektasi saya.',                    
        status: 'approved', 
        created_at: new Date(Date.now() - 21 * 86400_000).toISOString() 
    },
    { 
        id: 5, 
        name: 'Siti Nurhaliza', 
        rating: 5, 
        comment: 'Eyebrow embroidery-nya sangat natural, tidak keliatan seperti sulam alis biasa!',     
        status: 'approved', 
        created_at: new Date(Date.now() - 30 * 86400_000).toISOString() 
    },
    { 
        id: 6, 
        name: 'Farah Diba',     
        rating: 5, 
        comment: 'Foot spa-nya sangat relaxing. Kaki jadi halus dan segar. Wajib balik lagi!',          
        status: 'approved', 
        created_at: new Date(Date.now() - 32 * 86400_000).toISOString() 
    },
];

// Helper to read localStorage
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
    // Seed if empty
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
}

// Helper to write localStorage and dispatch broadcast event
function lsWrite(reviews) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(reviews));
        broadcast();
    } catch (e) {
        console.error('Error writing reviews to localStorage', e);
    }
}

function broadcast() {
    window.dispatchEvent(new Event('gsu_reviews_updated'));
}

function extractList(data) {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    return [];
}

// Fast cached health check for backend (10 seconds TTL to avoid constant lag)
let backendCheckCache = { alive: false, lastCheck: 0 };
async function isBackendAlive() {
    const now = Date.now();
    if (now - backendCheckCache.lastCheck < 10000) {
        return backendCheckCache.alive;
    }
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1200);
        const res = await fetch(`${BASE_URL}/api/reviews?status=approved&limit=1`, {
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
 * Fetch approved reviews for the public page.
 */
export async function fetchApprovedReviews() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/reviews?status=approved`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                return extractList(data).filter((r) => r.status === 'approved');
            }
        } catch (_) {}
    }
    // Fallback: localStorage approved reviews
    return lsRead().filter((r) => r.status === 'approved');
}

/**
 * Fetch all reviews for admin panel (all statuses: pending, approved, hidden).
 */
export async function fetchAllReviews() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch('/api/admin/reviews');
            const data = await res.json();
            if (res.ok && data.success) {
                return extractList(data);
            }
        } catch (_) {}
    }
    // Fallback: localStorage all reviews sorted newest first
    return [...lsRead()].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

/**
 * Submit a review from public form (always pending status).
 */
export async function submitReview({ name, rating, comment }) {
    const payload = {
        name: name.trim(),
        rating: Number(rating) || 5,
        comment: comment.trim(),
    };

    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok && data.success && data.data) {
                broadcast();
                return data.data;
            }
        } catch (_) {}
    }

    // Fallback: keep the review available locally when the backend is offline.
    const localReview = {
        id: Date.now(),
        ...payload,
        status: 'pending',
        created_at: new Date().toISOString(),
    };
    lsWrite([localReview, ...lsRead()]);
    return localReview;
}

/**
 * Update review status ('approved', 'hidden', 'pending').
 */
export async function updateReviewStatus(id, status) {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch(`/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                const all = lsRead();
                lsWrite(all.map((r) => (String(r.id) === String(id) ? { ...r, status } : r)));
                return data.data;
            }
        } catch (_) {}
    }

    const all = lsRead();
    const updated = all.map((r) => (String(r.id) === String(id) ? { ...r, status } : r));
    lsWrite(updated);
    return updated.find((r) => String(r.id) === String(id)) || null;
}

/**
 * Delete a review.
 */
export async function deleteReview(id) {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                lsWrite(lsRead().filter((r) => String(r.id) !== String(id)));
                return true;
            }
        } catch (_) {}
    }

    lsWrite(lsRead().filter((r) => String(r.id) !== String(id)));
    return true;
}
