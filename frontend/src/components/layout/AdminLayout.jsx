import AOS from 'aos';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { fetchAdminSession, getAdminUser, logoutAdmin } from '../../services/adminAuth';

const NAV_ITEMS = [
  { name: 'Ulasan', path: '/admin/ulasan' },
  { name: 'Layanan', path: '/admin/layanan' },
  { name: 'Nail Art', path: '/admin/nail-art' },
  { name: 'Recruit', path: '/admin/recruit' },
  { name: 'Pengaturan', path: '/admin/pengaturan' },
];

function getInitials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'A'
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAdminUser());
  const [checkingSession, setCheckingSession] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: false });
    AOS.refresh();

    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;

    fetchAdminSession()
      .then((sessionUser) => {
        if (!active) return;

        if (!sessionUser) {
          navigate('/admin/login', { replace: true });
          return;
        }

        setUser(sessionUser);
        setCheckingSession(false);
      })
      .catch(() => {
        if (active) navigate('/admin/login', { replace: true });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    const handleUnauthorized = () => navigate('/admin/login', { replace: true });
    window.addEventListener('gsu_admin_unauthorized', handleUnauthorized);

    return () => window.removeEventListener('gsu_admin_unauthorized', handleUnauthorized);
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
      isActive ? 'text-[#20241f]' : 'text-[#8b9088] hover:text-[#20241f]'
    }`;

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3efe9] font-sans">
        <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-[#8b9088]">
          <ShieldCheck className="h-4 w-4" />
          Memeriksa sesi admin...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3efe9] font-sans text-[#20241f] selection:bg-[#20241f] selection:text-white">
      <header
        className={`sticky top-0 z-40 border-b border-black/[0.07] transition-all duration-300 ${
          scrolled ? 'bg-[#f7f4ef]/95 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-md' : 'bg-[#f7f4ef]'
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <NavLink
            to="/admin/ulasan"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <img
              src="/1-logo.png"
              alt="PT GSU"
              className="h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-serif text-[15px] tracking-wide text-[#20241f]">
                Shofi Eyelash
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9a9e96]">
                Panel Administrasi
              </span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    <span
                      className={`absolute -bottom-[1px] left-0 h-[1.5px] bg-[#20241f] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 border border-[#ddd6c9] bg-white/60 py-1.5 pl-1.5 pr-3 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center bg-[#20241f] text-[10px] font-semibold text-white">
                {getInitials(user?.name)}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="max-w-[140px] truncate text-[11px] font-semibold text-[#20241f]">
                  {user?.name || 'Administrator'}
                </span>
                <span className="max-w-[140px] truncate text-[10px] text-[#9a9e96]">
                  {user?.email || 'Sesi aktif'}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden items-center gap-1.5 border border-[#ddd6c9] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f746c] transition-colors hover:border-[#20241f] hover:text-[#20241f] disabled:opacity-60 sm:inline-flex"
              title="Keluar dari sesi admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              {loggingOut ? 'Keluar...' : 'Keluar'}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center border border-[#ddd6c9] text-[#20241f] transition-colors hover:border-[#20241f] md:hidden"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-black/[0.07] bg-[#f7f4ef] px-5 py-3 md:hidden">
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-black/[0.05] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      isActive ? 'text-[#20241f]' : 'text-[#8b9088]'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center bg-[#20241f] text-[10px] font-semibold text-white">
                  {getInitials(user?.name)}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold text-[#20241f]">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-[#9a9e96]">
                    {user?.email || 'Sesi aktif'}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1.5 border border-[#ddd6c9] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f746c] transition-colors hover:border-[#20241f] hover:text-[#20241f] disabled:opacity-60"
              >
                <LogOut className="h-3.5 w-3.5" />
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-black/[0.07] bg-[#f7f4ef] py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 text-[10px] uppercase tracking-[0.16em] text-[#9a9e96] sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} PT Giandra Sadawira Utama</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Sesi terautentikasi
          </span>
        </div>
      </footer>
    </div>
  );
}
