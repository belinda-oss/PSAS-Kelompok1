/**
 * reviewsService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared reviews data layer — dual-mode (REST API + localStorage real-time bridge)
 *
 * • Public page (/shofi-eyelash) submits reviews with status: 'pending'.
 * • Admin page (/admin/ulasan) sees all reviews, including pending ones.
 * • Admin approves ('approved'), hides ('hidden'), or deletes reviews.
 * • Only 'approved' reviews are visible on the public page.
 * • Real-time event synchronization keeps all tabs and pages in sync.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const LS_KEY = 'gsu_reviews_v1';

// Seed initial approved reviews
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
        window.dispatchEvent(new Event('gsu_reviews_updated'));
    } catch (e) {
        console.error('Error writing reviews to localStorage', e);
    }
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
 * Fetch approved reviews for the public page
 */
export async function fetchApprovedReviews() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/reviews?status=approved`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                const list = Array.isArray(data.data) ? data.data : (data.data?.data ?? []);
                return list;
            }
        } catch (_) {}
    }
    // Fallback: localStorage approved reviews
    return lsRead().filter(r => r.status === 'approved');
}

/**
 * Fetch all reviews for admin panel (all statuses: pending, approved, hidden)
 */
export async function fetchAllReviews() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/reviews`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                const list = Array.isArray(data.data) ? data.data : (data.data?.data ?? []);
                return list;
            }
        } catch (_) {}
    }
    // Fallback: localStorage all reviews sorted newest first
    return [...lsRead()].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

/**
 * Submit a review from public form (always pending status)
 */
export async function submitReview({ name, rating, comment }) {
    const newReview = {
        id: Date.now(),
        name: name.trim(),
        rating: Number(rating) || 5,
        comment: comment.trim(),
        status: 'pending', // always pending until admin verifies
        created_at: new Date().toISOString(),
    };

    // Always persist to localStorage first so admin sees it immediately
    const all = lsRead();
    lsWrite([newReview, ...all]);

    // Also attempt to push to backend
    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(newReview),
            });
        } catch (_) {}
    }

    return newReview;
}

/**
 * Update review status ('approved', 'hidden', 'pending')
 */
export async function updateReviewStatus(id, status) {
    const all = lsRead();
    const updated = all.map(r => String(r.id) === String(id) ? { ...r, status } : r);
    lsWrite(updated);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/reviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ status }),
            });
        } catch (_) {}
    }
}

/**
 * Delete a review
 */
export async function deleteReview(id) {
    const all = lsRead();
    const filtered = all.filter(r => String(r.id) !== String(id));
    lsWrite(filtered);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            await fetch(`${BASE_URL}/api/reviews/${id}`, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
        } catch (_) {}
    }
}
