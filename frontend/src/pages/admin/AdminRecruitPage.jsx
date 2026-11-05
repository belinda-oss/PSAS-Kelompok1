import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Check,
  Clock,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  UserRound,
  ClipboardList,
  UserCheck,
  Link2,
} from 'lucide-react';
import {
  fetchAllApplications,
  updateReviewedStatus,
  deleteApplication,
} from '../../services/recruitmentService';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'unreviewed', label: 'Belum Ditinjau' },
  { key: 'reviewed', label: 'Sudah Ditinjau' },
];

export default function AdminRecruitPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    try {
      const data = await fetchAllApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load job applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('gsu_job_applications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gsu_job_applications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleReviewed = async (item) => {
    const nextValue = !item.is_reviewed;
    await updateReviewedStatus(item.id, nextValue);
    await loadData();
    const name = item.full_name || item.name || 'pelamar';
    showToast(
      nextValue
        ? `Lamaran dari "${name}" ditandai sudah ditinjau.`
        : `Lamaran dari "${name}" ditandai belum ditinjau.`
    );
  };

  const handleDelete = async (item) => {
    const name = item.full_name || item.name || 'pelamar';
    if (!window.confirm(`Hapus lamaran dari "${name}" secara permanen?`)) return;
    await deleteApplication(item.id);
    await loadData();
    showToast(`Lamaran dari "${name}" berhasil dihapus.`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Baru saja';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredApplications = applications.filter((item) => {
    const name = item.full_name || item.name || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'reviewed' && item.is_reviewed) ||
      (statusFilter === 'unreviewed' && !item.is_reviewed);
    return matchesSearch && matchesStatus;
  });

  const totalCount = applications.length;
  const reviewedCount = applications.filter((item) => item.is_reviewed).length;
  const unreviewedCount = totalCount - reviewedCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2421] text-white text-xs px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fadeIn border border-white/10">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1f2421] tracking-wide mb-2.5">
          Manajemen Recruit
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Kelola lamaran kerja yang dikirim dari halaman Recruit. Tandai lamaran sebagai sudah ditinjau atau belum ditinjau.
        </p>
      </motion.div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'TOTAL LAMARAN', value: totalCount, suffix: 'pelamar', icon: ClipboardList },
          { label: 'BELUM DITINJAU', value: unreviewedCount, suffix: 'lamaran', icon: Clock },
          { label: 'SUDAH DITINJAU', value: reviewedCount, suffix: 'lamaran', icon: UserCheck },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
              className="border border-gray-100 bg-white p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase">
                  {stat.label}
                </p>
                <Icon className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400 font-light">{stat.suffix}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters + Search */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all ${
                statusFilter === filter.key
                  ? 'bg-[#1f2421] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[#c49a6c] hover:text-[#1f2421]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau posisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs text-gray-800 placeholder:text-gray-400 bg-white border border-gray-200 rounded-full w-full sm:w-72 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all"
          />
        </div>
      </motion.div>

      {/* Applications List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400 rounded-2xl">
            Memuat data lamaran...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl">
            {searchQuery || statusFilter !== 'all'
              ? 'Tidak ada lamaran yang cocok dengan filter yang dipilih.'
              : 'Belum ada lamaran masuk dari halaman Recruit.'}
          </div>
        ) : (
          filteredApplications.map((item, index) => {
            const name = item.full_name || item.name || 'Tanpa Nama';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
                className={`bg-white border p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  item.is_reviewed
                    ? 'border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#e8ded2]'
                    : 'border-amber-300 bg-amber-50/20 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Applicant Info */}
                  <div className="flex-1 space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="w-9 h-9 rounded-full bg-[#f9f7f4] border border-[#e8ded2] text-[#8a6d47] flex items-center justify-center shrink-0">
                        <UserRound className="w-4 h-4" />
                      </span>
                      <span className="font-serif text-base font-semibold text-[#1f2421]">
                        {name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 font-light">
                        {formatDate(item.created_at)}
                      </span>
                      {item.is_reviewed ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Sudah Ditinjau
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Belum Ditinjau
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        {item.position || '-'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`mailto:${item.email}`} className="hover:text-[#b08556] transition-colors">
                          {item.email}
                        </a>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {item.phone || '-'}
                      </span>
                      {item.experience && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {item.experience}
                        </span>
                      )}
                    </div>

                    {item.cover_letter && (
                      <p className="text-xs sm:text-[13px] text-gray-700 font-light leading-relaxed bg-[#fbfbfb] border border-gray-100 rounded-xl px-3.5 py-2.5">
                        "{item.cover_letter}"
                      </p>
                    )}

                    {item.portfolio_url && (
                      <a
                        href={item.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#8a6d47] hover:text-[#b08556] font-medium transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Lihat Portofolio / CV</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0 lg:w-44">
                    <button
                      type="button"
                      onClick={() => handleToggleReviewed(item)}
                      className={`text-[11px] px-3 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 ${
                        item.is_reviewed
                          ? 'bg-white border border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {item.is_reviewed ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tandai Belum Ditinjau</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tandai Sudah Ditinjau</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-[11px] px-3 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Hapus lamaran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
