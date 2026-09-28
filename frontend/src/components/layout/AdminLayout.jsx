import AOS from 'aos';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
    AOS.refresh();

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Ulasan', path: '/admin/ulasan' },
    { name: 'Layanan', path: '/admin/layanan' },
    { name: 'Pengaturan', path: '/admin/pengaturan' },
  ];

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-[0.2em] uppercase relative group py-1 transition-colors duration-200 ${
      isActive ? 'text-[#1f2421]' : 'text-gray-500 hover:text-[#1f2421]'
    }`;

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-gray-900 flex flex-col font-sans selection:bg-[#212121] selection:text-white">
      {/* Top Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-white border-b border-black/5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 sm:py-0 min-h-[4.5rem] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Brand Logo */}
          <NavLink
            to="/admin/ulasan"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src="/gsu-logo.jpg"
              alt="PT GSU"
              style={{ maxHeight: '38px', width: 'auto', objectFit: 'contain' }}
              className="mix-blend-multiply transition-all duration-300 group-hover:opacity-80"
            />
            <span className="font-sans text-[11px] tracking-[0.25em] text-gray-400 font-medium uppercase">
              SHOFI EYELASH ADMIN
            </span>
          </NavLink>

          {/* Right Navigation */}
          <div className="flex items-center gap-7 sm:gap-9">
            <nav className="flex items-center gap-6 sm:gap-8">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{item.name}</span>
                      <span
                        className={`absolute -bottom-px left-0 h-[1.5px] bg-[#1f2421] transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      ></span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs tracking-wider text-gray-500 hover:text-[#b08556] transition-colors py-1 pl-2 focus:outline-none group"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="font-medium uppercase text-[11px] tracking-widest">KELUAR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-6 sm:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 font-sans">
          <span>
            © PT Graha Sahabat Utama • Shofi Eyelash Admin Portal
          </span>
          <span className="tracking-wide">
            Versi Minimalis 2.0
          </span>
        </div>
      </footer>
    </div>
  );
}