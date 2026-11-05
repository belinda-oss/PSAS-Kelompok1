/**
 * recruitmentService.js
 * -----------------------------------------------------------------------------
 * Data layer untuk lamaran kerja (Recruit / Join Our Team).
 *
 * - Halaman publik (/recruit) mengirim lamaran lewat JobApplicationModal.
 * - Dashboard admin (/admin/recruit) membaca semua lamaran, menandai
 *   "sudah ditinjau" / "belum ditinjau", dan menghapus data.
 * - Endpoint Laravel: POST /api/job-applications
 *                     GET/PATCH/DELETE /api/admin/job-applications
 * - Tetap bisa dipakai saat backend mati lewat fallback localStorage.
 * -----------------------------------------------------------------------------
 */

import { adminFetch } from './adminAuth';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const LS_KEY = 'gsu_job_applications_v1';

const SEED_APPLICATIONS = [
    {
        id: 1,
        full_name: 'Amanda Putri',
        name: 'Amanda Putri',
        email: 'amanda.putri@example.com',
        phone: '+62 812-3456-7890',
        position: 'Senior Eyelash Artist',
        experience: '3-5 Tahun',
        portfolio_url: 'https://linkedin.com/in/amandaputri',
        cover_letter: 'Saya memiliki pengalaman 4 tahun sebagai eyelash artist dan ingin berkembang bersama Shofi Eyelash.',
        is_reviewed: false,
        admin_notes: null,
        created_at: new Date(Date.now() - 1 * 86400_000).toISOString(),
    },
    {
        id: 2,
        full_name: 'Rina Kartika',
        name: 'Rina Kartika',
        email: 'rina.kartika@example.com',
        phone: '+62 813-2233-4455',
        position: 'Digital Marketing & Social Media',
        experience: '1-3 Tahun',
        portfolio_url: 'https://drive.google.com/file/d/1contoh-cv',
        cover_letter: 'Saya tertarik membangun konten kecantikan yang kreatif untuk brand Shofi Eyelash.',
        is_reviewed: true,
        admin_notes: null,
        created_at: new Date(Date.now() - 3 * 86400_000).toISOString(),
    },
    {
        id: 3,
        full_name: 'Dewi Rahayu',
        name: 'Dewi Rahayu',
        email: 'dewi.rahayu@example.com',
        phone: '+62 811-9988-7766',
        position: 'Nail Art Specialist',
        experience: '1-3 Tahun',
        portfolio_url: null,
        cover_letter: 'Saya suka membuat desain nail art dan ingin bergabung dengan tim yang suportif.',
        is_reviewed: true,
        admin_notes: null,
        created_at: new Date(Date.now() - 6 * 86400_000).toISOString(),
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
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_APPLICATIONS));
    return SEED_APPLICATIONS;
}

function lsWrite(applications) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(applications));
        window.dispatchEvent(new Event('gsu_job_applications_updated'));
    } catch (e) {
        console.error('Error writing job applications to localStorage', e);
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
        const res = await fetch(`${BASE_URL}/api/reviews?limit=1`, {
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

function normalize(payload) {
    return {
        full_name: (payload.full_name || payload.fullName || '').trim(),
        email: (payload.email || '').trim(),
        phone: (payload.phone || '').trim(),
        position: (payload.position || '').trim(),
        experience: payload.experience || '',
        portfolio_url: (payload.portfolio_url || payload.portfolio || '').trim() || null,
        cover_letter: (payload.cover_letter || payload.coverLetter || '').trim() || null,
    };
}

/**
 * Fetch every application for the admin dashboard.
 */
export async function fetchAllApplications() {
    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch('/api/admin/job-applications');
            const data = await res.json();
            if (data.success) return extractList(data);
        } catch (_) {}
    }
    return [...lsRead()].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

/**
 * Submit a job application from the public Recruit page.
 */
export async function submitJobApplication(payload) {
    const application = normalize(payload);
    const localRecord = {
        id: Date.now(),
        ...application,
        name: application.full_name,
        is_reviewed: false,
        admin_notes: null,
        created_at: new Date().toISOString(),
    };

    // Selalu simpan lokal dulu supaya admin langsung melihat lamaran baru.
    lsWrite([localRecord, ...lsRead()]);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await fetch(`${BASE_URL}/api/job-applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(application),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Gagal mengirim lamaran.');
            }
            return data.data;
        } catch (err) {
            console.error('[RecruitmentService] submitJobApplication error:', err);
            throw err;
        }
    }

    return localRecord;
}

/**
 * Update status and/or admin notes for an application.
 */
export async function updateApplication(id, payload) {
    const all = lsRead();
    const updated = all.map((item) =>
        String(item.id) === String(id) ? { ...item, ...payload } : item
    );
    lsWrite(updated);

    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch(`/api/admin/job-applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok && data.success) return data.data;
        } catch (_) {}
    }

    return updated.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Tandai lamaran sudah ditinjau (true) atau belum ditinjau (false).
 */
export async function updateReviewedStatus(id, isReviewed) {
    return updateApplication(id, { is_reviewed: isReviewed });
}

/**
 * Delete an application.
 */
export async function deleteApplication(id) {
    lsWrite(lsRead().filter((item) => String(item.id) !== String(id)));

    const alive = await isBackendAlive();
    if (alive) {
        try {
            const res = await adminFetch(`/api/admin/job-applications/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok && data.success) return true;
        } catch (_) {}
    }

    return true;
}
