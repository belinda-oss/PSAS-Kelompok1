import AOS from 'aos';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Check, KeyRound } from 'lucide-react';

export default function AdminPengaturanPage() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
    AOS.refresh();
  }, []);
  const [whatsappNumber, setWhatsappNumber] = useState('+62 812-3456-7890');
  const [autoPublishReviews, setAutoPublishReviews] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@gsu-eyelash.com');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
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

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2421] text-white text-xs px-5 py-3 rounded-sm shadow-xl flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div data-aos="fade-up">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1f2421] tracking-wide mb-2.5">
          Pengaturan Salon &amp; Website
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Konfigurasi informasi kontak reservasi, jam operasional, dan akun admin.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Section 1: Kontak WhatsApp Reservasi */}
        <div
          data-aos="fade-up"
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Info */}
            <div className="md:col-span-4 space-y-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide">
                Kontak WhatsApp Reservasi
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Nomor customer care tujuan saat pengunjung menekan tombol booking.
              </p>
            </div>

            {/* Right Input */}
            <div className="md:col-span-8 space-y-2">
              <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                NOMOR WHATSAPP ADMIN
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+62 8xx-xxxx-xxxx"
                className="w-full py-2.5 px-3.5 bg-[#fbfbfb] border border-gray-200 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-colors"
              />
              <p className="text-[11px] text-gray-400 font-light pt-0.5">
                Nomor ini akan otomatis dihubungi ketika pengunjung menekan tombol 'Reservasi' di website.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Moderasi Ulasan */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Info */}
            <div className="md:col-span-4 space-y-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide">
                Moderasi Ulasan
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Kontrol penayangan review baru dari pelanggan secara otomatis atau tersaring.
              </p>
            </div>

            {/* Right Toggle */}
            <div className="md:col-span-8 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-[13px] font-medium text-gray-900">
                  Tampilkan ulasan baru secara langsung
                </p>
                <p className="text-[11px] text-gray-400 font-light">
                  Jika dinonaktifkan, ulasan baru masuk ke daftar moderasi terlebih dahulu.
                </p>
              </div>

              {/* Modern Toggle Switch */}
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
        </div>

        {/* Section 3: Akun Administrator */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="border border-gray-100 bg-white p-6 sm:p-8 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Info */}
            <div className="md:col-span-4 space-y-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1f2421] tracking-wide">
                Akun Administrator
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Kelola data otentikasi dan kredensial masuk ke panel admin.
              </p>
            </div>

            {/* Right Form */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2">
                  EMAIL LOGIN
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-[#fbfbfb] border border-gray-200 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-colors"
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
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-4" data-aos="fade-up" data-aos-delay="300">
          <button
            type="submit"
            className="bg-[#1f2421] text-white text-xs font-medium px-8 py-3 rounded-none uppercase tracking-widest hover:bg-[#c49a6c] active:scale-[0.99] transition-all shadow-sm focus:outline-none"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Change Password Modal */}
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
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    KATA SANDI LAMA
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    KATA SANDI BARU
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    KONFIRMASI KATA SANDI BARU
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#1f2421] hover:border-[#1f2421] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1f2421] text-white hover:bg-[#c49a6c] transition-colors font-medium"
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
