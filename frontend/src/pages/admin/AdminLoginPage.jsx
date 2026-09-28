import AOS from 'aos';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
    AOS.refresh();
  }, []);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ptgsu.co.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem('admin_authenticated', 'true');
      setIsLoading(false);
      navigate('/admin/ulasan');
    }, 400);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Silakan hubungi Divisi IT PT Giandra Sadawira Utama (admin@ptgsu.co.id) untuk mengatur ulang kata sandi Anda.');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center px-4 py-12 selection:bg-[#212121] selection:text-white font-sans relative overflow-hidden">
      {/* Decorative floating sparkle accents (PT GSU signature) */}
      <div
        className="pointer-events-none absolute top-16 left-10 w-2 h-2 rounded-full bg-[#c49a6c]/40 animate-float hidden md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-20 right-12 w-2.5 h-2.5 rounded-full bg-[#d4af37]/40 animate-float-delayed hidden md:block"
        aria-hidden="true"
      />

      <div className="w-full max-w-[460px]" data-aos="fade-up" data-aos-duration="700">
        <div className="bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-12">
          {/* Brand Header */}
          <div className="text-center">
            <div data-aos="fade-down" data-aos-duration="600">
              <img
                src="/gsu-logo.jpg"
                alt="PT GSU"
                className="h-12 sm:h-14 w-auto object-contain mx-auto mix-blend-multiply"
              />
            </div>
            <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-medium mt-3 mb-6">
              • SHOFI EYELASH ADMIN •
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1f2421] tracking-wide mb-2">
              Login Administrator
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Portal Pengelolaan & Moderasi Rating Pengunjung
            </p>
            <p className="text-xs text-gray-500 font-normal mb-8">
              Shofi Eyelash
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-2">
                EMAIL / ID ADMIN
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ptgsu.co.id"
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-gray-900 bg-[#fbfbfb] border border-gray-200 rounded-none focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-2">
                KATA SANDI
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-gray-900 bg-[#fbfbfb] border border-gray-200 rounded-none focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all placeholder:text-gray-400 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 pb-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#1f2421] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[11px] text-gray-600 group-hover:text-gray-900 transition-colors">
                  Ingat Sesi Ini
                </span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] text-gray-500 hover:text-[#b08556] transition-colors relative group py-0.5"
              >
                Lupa Kata Sandi?
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c49a6c] transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1f2421] text-white text-xs font-semibold py-3.5 tracking-widest uppercase hover:bg-[#c49a6c] active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-75"
            >
              {isLoading ? (
                <span className="animate-pulse">MEMPROSES...</span>
              ) : (
                <>
                  <span>MASUK KE PORTAL ADMIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider with Text */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                AKSES TEROTENTIKASI
              </span>
            </div>
          </div>

          {/* Info Text */}
          <div className="text-center space-y-1">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Sistem Terintegrasi PT Giandra Sadawira Utama.
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Akses terbatas untuk staf dan manajemen Shofi Eyelash.
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium pt-3">
              ID ENKRIPSI: TLS-256 • VERSI 2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}