/**
 * useContactSettings
 * ------------------
 * Shared hook untuk membaca & menyimpan pengaturan kontak (nomor WA per departemen)
 * menggunakan localStorage sebagai state persisten di sisi klien.
 *
 * Key yang digunakan:
 *   gsu_wa_beauty   → WhatsApp Admin Jasa Kecantikan (Shofi Eyelash)
 *   gsu_wa_distrib  → WhatsApp Admin Distributor / Owner
 */

const KEYS = {
  beauty: 'gsu_wa_beauty',
  distributor: 'gsu_wa_distrib',
};

const DEFAULTS = {
  beauty: '+6281234567890',
  distributor: '+6289876543210',
};

/** Baca pengaturan kontak dari localStorage. */
export function getContactSettings() {
  return {
    waBeauty: localStorage.getItem(KEYS.beauty) || DEFAULTS.beauty,
    waDistributor: localStorage.getItem(KEYS.distributor) || DEFAULTS.distributor,
  };
}

/** Simpan pengaturan kontak ke localStorage. */
export function saveContactSettings({ waBeauty, waDistributor }) {
  if (waBeauty !== undefined) {
    localStorage.setItem(KEYS.beauty, waBeauty.trim());
  }
  if (waDistributor !== undefined) {
    localStorage.setItem(KEYS.distributor, waDistributor.trim());
  }
}

/**
 * Bersihkan nomor WA agar valid untuk deep-link wa.me
 * Contoh: "+62 812-3456-7890" → "628123456789"
 */
export function sanitizeWANumber(raw) {
  return raw.replace(/[^0-9]/g, '');
}

/**
 * Buat URL WhatsApp dengan pesan default.
 * @param {string} waNumber  - Nomor WA mentah (boleh ada spasi/tanda baca)
 * @param {string} message   - Pesan yang akan dikirim
 */
export function buildWALink(waNumber, message = '') {
  const num = sanitizeWANumber(waNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${num}${encoded ? `?text=${encoded}` : ''}`;
}
