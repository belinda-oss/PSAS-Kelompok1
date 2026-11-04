import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Check, KeyRound, Scissors, Package, Info } from 'lucide-react';
import { getContactSettings, saveContactSettings } from '../../hooks/useContactSettings';

export default function AdminPengaturanPage() {
  // ── Kontak WA per departemen ──────────────────────────────────────────────
  const initContacts = getContactSettings();
  const [waBeauty, setWaBeauty] = useState(initContacts.waBeauty);
  const [waDistributor, setWaDistributor] = useState(initContacts.waDistributor);

  // ── Pengaturan lainnya ────────────────────────────────────────────────────
  const [autoPublishReviews, setAutoPublishReviews] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@gsu-eyelash.com');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Simpan nomor WA ke localStorage agar terbaca oleh ContactModal
    saveContactSettings({ waBeauty, waDistributor });
    showToast('Pengaturan salon & website berhasil disimpan!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Kata sandi administrator berhasil diperbarui!');
  };

  // ── Shared input class ────────────────────────────────────────────────────
  const inputClass =
    'w-full py-2.5 px-3.5 bg-[#fbfbfb] border border-gray-200 text-xs text-gray-900 rounded-xl focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-colors';

  const cardVariants = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  });

  return (
    <div className="space-y-8">
      {/* ── Toast Alert ─────────────────────────────────────────────────── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2421] text-white text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1f2421] tracking-wide mb-2.5">
          Pengaturan Salon &amp; Website
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Konfigurasi nomor WhatsApp per departemen, moderasi ulasan, jam operasional, dan akun admin.
        </p>
      </motion.div>

      {/* ── Settings Form ────────────────────────────────────────────────── */}
      <form onSubmit={handleSaveSettings} className="space-y-5">

        {/* ── SECTION 1: Kontak WhatsApp per Departemen ────────────────── */}
        <motion.div
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
          {...cardVariants(0)}
        >
          {/* Section heading */}
          <div className="mb-6">
            <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide mb-1">
              Kontak WhatsApp per Departemen
            </h2>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Nomor-nomor ini akan digunakan secara dinamis pada form "Hubungi Kami" di website,
              sesuai departemen yang dipilih pengunjung.
            </p>
          </div>

          <div className="space-y-5">
            {/* WhatsApp Admin Jasa Kecantikan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-5 border-b border-gray-50">
              <div className="md:col-span-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c49a6c]/12 flex items-center justify-center shrink-0 mt-0.5">
                  <Scissors size={15} className="text-[#c49a6c]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1f2421]">Admin Jasa Kecantikan</p>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5 leading-snug">
                    Shofi Eyelash — Reservasi, layanan salon, nail art, sulam alis &amp; bibir.
                  </p>
                </div>
              </div>
              <div className="md:col-span-7 space-y-1.5">
                <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Nomor WhatsApp Admin Jasa Kecantikan
                </label>
                <input
                  type="text"
                  value={waBeauty}
                  onChange={(e) => setWaBeauty(e.target.value)}
                  placeholder="+62 8xx-xxxx-xxxx"
                  className={inputClass}
                />
                <p className="text-[11px] text-gray-400 font-light">
                  Diarahkan ke nomor ini saat pengunjung memilih "Admin Jasa Kecantikan".
                </p>
              </div>
            </div>

            {/* WhatsApp Admin Distributor / Owner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1f2421]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Package size={15} className="text-[#1f2421]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1f2421]">Admin Distributor / Owner</p>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5 leading-snug">
                    PT GSU — Distribusi alat kecantikan, kemitraan bisnis, dan pertanyaan owner.
                  </p>
                </div>
              </div>
              <div className="md:col-span-7 space-y-1.5">
                <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Nomor WhatsApp Admin Distributor / Owner
                </label>
                <input
                  type="text"
                  value={waDistributor}
                  onChange={(e) => setWaDistributor(e.target.value)}
                  placeholder="+62 8xx-xxxx-xxxx"
                  className={inputClass}
                />
                <p className="text-[11px] text-gray-400 font-light">
                  Diarahkan ke nomor ini saat pengunjung memilih "Admin Distributor / Owner".
                </p>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2.5 bg-[#f9f7f4] border border-[#e8ded2] rounded-xl px-4 py-3">
              <Info size={14} className="text-[#c49a6c] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Perubahan akan langsung aktif setelah disimpan dan akan memengaruhi tombol <strong>"Kirim via WhatsApp"</strong> pada form kontak di website.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 2: Moderasi Ulasan ───────────────────────────────── */}
        <motion.div
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
          {...cardVariants(0.08)}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide">
                Moderasi Ulasan
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Kontrol penayangan review baru dari pelanggan secara otomatis atau tersaring.
              </p>
            </div>
            <div className="md:col-span-8 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-[13px] font-medium text-gray-900">
                  Tampilkan ulasan baru secara langsung
                </p>
                <p className="text-[11px] text-gray-400 font-light">
                  Jika dinonaktifkan, ulasan baru masuk ke daftar moderasi terlebih dahulu.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoPublishReviews}
                onClick={() => setAutoPublishReviews(!autoPublishReviews)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoPublishReviews ? 'bg-[#1f2421]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autoPublishReviews ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 3: Akun Administrator ───────────────────────────── */}
        <motion.div
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
          {...cardVariants(0.16)}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-4 space-y-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide">
                Akun Administrator
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Kelola data otentikasi dan kredensial masuk ke panel admin.
              </p>
            </div>
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2">
                  EMAIL LOGIN
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="text-xs font-medium text-gray-800 hover:text-[#b08556] pt-1 inline-flex items-center gap-1.5 focus:outline-none transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                  <span>Ubah Kata Sandi</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Footer Action ─────────────────────────────────────────────── */}
        <motion.div
          className="flex justify-end pt-4"
          {...cardVariants(0.2)}
        >
          <button
            type="submit"
            className="bg-[#1f2421] text-white text-xs font-medium px-8 py-3 rounded-full uppercase tracking-widest hover:bg-[#c49a6c] active:scale-[0.99] transition-all shadow-sm focus:outline-none"
          >
            Simpan Perubahan
          </button>
        </motion.div>
      </form>

      {/* ── Change Password Modal ─────────────────────────────────────── */}
      {isPasswordModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="modal-content">
              <h3 className="font-serif text-xl font-medium text-[#1f2421] tracking-wide mb-1">
                Ubah Kata Sandi
              </h3>
              <p className="text-xs text-gray-400 font-light mb-6">
                Masukkan kata sandi lama dan tentukan kata sandi baru Anda.
              </p>
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                {[
                  { key: 'oldPassword', label: 'KATA SANDI LAMA' },
                  { key: 'newPassword', label: 'KATA SANDI BARU' },
                  { key: 'confirmPassword', label: 'KONFIRMASI KATA SANDI BARU' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                      {label}
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm[key]}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, [key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-xl"
                    />
                  </div>
                ))}
                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#1f2421] hover:border-[#1f2421] rounded-full transition-colors text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1f2421] text-white hover:bg-[#c49a6c] rounded-full transition-colors font-medium text-xs"
                  >
                    Simpan Kata Sandi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
