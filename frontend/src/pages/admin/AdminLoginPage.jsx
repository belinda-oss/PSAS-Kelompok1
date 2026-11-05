import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { fetchAdminSession, loginAdmin } from '../../services/adminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = location.state?.from || '/admin/ulasan';

  useEffect(() => {
    let active = true;

    fetchAdminSession().then((user) => {
      if (active && user) {
        navigate('/admin/ulasan', { replace: true });
      }
    });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAdmin({ email: email.trim(), password, remember });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal masuk ke panel admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const detectCapsLock = (event) => {
    if (typeof event.getModifierState === 'function') {
      setCapsLock(event.getModifierState('CapsLock'));
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe9] font-sans text-[#20241f] selection:bg-[#20241f] selection:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* Panel visual */}
        <aside className="relative hidden overflow-hidden bg-[#171a16] lg:flex">
          <img
            src="/assets/images/shofi-hero.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10130f] via-[#10130f]/70 to-[#10130f]/25" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3 text-white/75 transition-colors hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center border border-white/25 font-serif text-sm text-white">
                S
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em]">
                Shofi Eyelash
              </span>
            </Link>

            <div className="max-w-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d9c3a5]">
                Portal internal
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-white xl:text-5xl">
                Ruang kerja
                <br />
                <span className="italic text-[#e6d6bf]">tim Shofi.</span>
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
                Kelola ulasan, layanan, katalog nail art, dan lamaran kerja
                dalam satu panel yang tenang dan teratur.
              </p>
              <div className="mt-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                <span className="h-px w-10 bg-white/30" />
                PT Giandra Sadawira Utama
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              Akses terbatas untuk staf
            </div>
          </div>
        </aside>

        {/* Panel form */}
        <main className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between lg:justify-end">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7c817a] transition-colors hover:text-[#20241f] lg:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Situs utama
            </Link>
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7c817a] transition-colors hover:text-[#20241f] lg:inline-flex"
            >
              Kembali ke situs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[380px] py-10">
            <img
              src="/1-logo.png"
              alt="Shofi Eyelash"
              className="mb-8 h-9 w-auto object-contain lg:mb-10"
            />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a1876a]">
              Administrasi
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-[#20241f] sm:text-[2.35rem]">
              Masuk ke panel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6f746c]">
              Gunakan akun administrator yang terdaftar untuk melanjutkan.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 border-l-2 border-[#a13c2f] bg-[#a13c2f]/[0.06] px-3.5 py-3 text-[13px] leading-relaxed text-[#8a3227]"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7c817a]"
                >
                  Email administrator
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@perusahaan.co.id"
                  className="w-full border-b border-[#cfcabf] bg-transparent px-0 py-2.5 text-sm text-[#20241f] placeholder:text-[#a8aca4] transition-colors focus:border-[#20241f] focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7c817a]"
                  >
                    Kata sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelp((value) => !value)}
                    className="text-[11px] text-[#8b7a63] transition-colors hover:text-[#20241f]"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyUp={detectCapsLock}
                    onKeyDown={detectCapsLock}
                    placeholder="Masukkan kata sandi"
                    className="w-full border-b border-[#cfcabf] bg-transparent py-2.5 pr-10 text-sm text-[#20241f] placeholder:text-[#a8aca4] transition-colors focus:border-[#20241f] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                    }
                    className="absolute inset-y-0 right-0 flex items-center text-[#8f948b] transition-colors hover:text-[#20241f]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {capsLock && (
                  <p className="mt-2 text-[11px] text-[#a1876a]">
                    Caps Lock sedang aktif.
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer select-none items-center gap-2.5 text-[12px] text-[#6f746c]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer rounded-sm border-[#c4c0b6] text-[#20241f] focus:ring-0 focus:ring-offset-0"
                />
                Ingat sesi di perangkat ini
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="group mt-1 flex w-full items-center justify-center gap-2 bg-[#20241f] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#3a4039] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a1876a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {showHelp && (
              <div className="mt-5 border border-[#ddd6c9] bg-white/60 px-4 py-3 text-[12px] leading-relaxed text-[#6f746c]">
                Untuk pengaturan ulang kata sandi, hubungi tim IT PT GSU di{' '}
                <a
                  href="mailto:admin@ptgsu.co.id"
                  className="text-[#20241f] underline underline-offset-2"
                >
                  admin@ptgsu.co.id
                </a>
                .
              </div>
            )}

            <div className="mt-10 flex items-start gap-2 text-[11px] leading-relaxed text-[#8f948b]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Koneksi aman. Jangan bagikan kredensial Anda kepada siapa pun.</span>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[380px] items-center justify-between border-t border-[#ddd6c9] pt-5 text-[10px] uppercase tracking-[0.18em] text-[#9a9e96]">
            <span>© {new Date().getFullYear()} PT GSU</span>
            <span>Panel Admin</span>
          </div>
        </main>
      </div>
    </div>
  );
}
