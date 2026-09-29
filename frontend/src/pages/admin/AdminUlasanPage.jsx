import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Check, Clock, Eye, EyeOff, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { fetchAllReviews, updateReviewStatus, deleteReview } from '../../services/reviewsService';

export default function AdminUlasanPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to real-time events across components or tabs
    const handleUpdate = () => loadData();
    window.addEventListener('gsu_reviews_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gsu_reviews_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'approved' ? 'hidden' : 'approved';
    await updateReviewStatus(item.id, nextStatus);
    await loadData();
    showToast(
      nextStatus === 'approved'
        ? `Ulasan dari "${item.name}" berhasil disetujui & tampil di website.`
        : `Ulasan dari "${item.name}" disembunyikan dari website.`
    );
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus ulasan dari "${name}" secara permanen?`)) {
      await deleteReview(id);
      await loadData();
      showToast(`Ulasan dari "${name}" berhasil dihapus.`);
    }
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

  // Filter reviews by search query
  const filteredReviews = reviews.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Statistics
  const totalCount = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-10 font-sans">
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
          Manajemen Ulasan &amp; Kepuasan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Moderasi feedback pengunjung website Shofi Eyelash secara langsung. Ulasan berstatus "Tampil di Web" akan muncul di etalase publik.
        </p>
      </motion.div>

      {/* Moderation Help Guide Banner */}
      {pendingCount > 0 ? (
        <motion.div
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Ada {pendingCount} ulasan baru yang menunggu persetujuan Anda:
            </p>
            <p className="text-amber-800 font-light leading-relaxed">
              Ulasan yang baru dikirim oleh pengunjung otomatis berstatus <strong>"Pending"</strong>. Klik tombol hijau <strong>"✓ SETUJUI (ACCEPT)"</strong> pada ulasan terkait di bawah agar seketika tampil di website publik.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Semua ulasan telah dimoderasi. Ulasan berstatus <strong>"Tampil di Web"</strong> sedang tayang di website publik.</span>
          </div>
          <Link
            to="/shofi-eyelash"
            className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1 shrink-0 self-end sm:self-auto"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink size={12} />
          </Link>
        </motion.div>
      )}

      {/* Statistics Row (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="border border-gray-100 bg-white p-6 sm:p-7 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#e8ded2]"
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            TOTAL ULASAN MASUK
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
              {totalCount}
            </span>
            <span className="text-xs text-gray-400 font-light">testimoni</span>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
          className="border border-gray-100 bg-white p-6 sm:p-7 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#e8ded2]"
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            RATA-RATA BINTANG
          </p>
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
              {avgRating}
            </span>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs text-gray-400 font-light">dari 5.0</span>
          </div>
        </motion.div>

        {/* Card 3: Pending reviews */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
          className={`border p-6 sm:p-7 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            pendingCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-gray-100'
          }`}
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            ULASAN BARU MENUNGGU VERIFIKASI
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`font-serif text-3xl sm:text-4xl font-normal tracking-wide ${pendingCount > 0 ? 'text-amber-700' : 'text-[#1f2421]'}`}>
              {pendingCount}
            </span>
<span className="text-xs text-gray-400 font-light">menunggu respons admin</span>
        </div>
        </motion.div>
      </div>

      {/* Reviews List Section */}
      <div className="pt-2">
        {/* Section Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1f2421] tracking-wide">
              Daftar Ulasan Pengunjung
            </h2>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Moderasi langsung tayangan ulasan website. Pesan yang baru dikirim akan masuk berstatus "Menunggu Verifikasi".
            </p>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau ulasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 bg-transparent border border-gray-200 rounded-full w-full sm:w-64 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all"
            />
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-gray-400 rounded-2xl">
              Memuat data ulasan...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 border border-dashed border-gray-200 bg-white rounded-2xl">
              Tidak ada ulasan yang cocok dengan pencarian "{searchQuery}".
            </div>
          ) : (
            filteredReviews.map((review, index) => {
              const isApproved = review.status === 'approved';
              const isPending = review.status === 'pending';

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25), ease: 'easeOut' }}
                  className={`bg-white border p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    isPending
                      ? 'border-amber-300 bg-amber-50/20 shadow-sm'
                      : 'border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#e8ded2]'
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-2 max-w-3xl">
                    {/* Author, Status Badge & Meta */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="font-serif text-sm font-semibold text-[#1f2421]">
                        {review.name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 font-light">
                        {formatDate(review.created_at || review.date)}
                      </span>

                      {/* Status Tag */}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Tampil di Web
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Menunggu Verifikasi
                        </span>
                      )}
                      {review.status === 'hidden' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          Disembunyikan
                        </span>
                      )}

                      <div className="flex items-center gap-0.5 text-amber-400 ml-1">
                        {[...Array(Math.max(1, Math.min(5, Number(review.rating) || 5)))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-[13px] text-gray-700 font-light leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(review)}
                      className={`text-xs px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'border border-gray-300 text-gray-700 bg-white hover:border-red-400 hover:text-red-600'
                          : isPending
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm ring-2 ring-emerald-400/40'
                          : 'bg-[#1f2421] text-white hover:bg-emerald-700'
                      }`}
                      title={isApproved ? 'Sembunyikan dari website' : 'Setujui dan tampilkan di website'}
                    >
                      {isApproved ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Sembunyikan</span>
                        </>
                      ) : isPending ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="tracking-wide">✓ SETUJUI (ACCEPT)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tampil di Web</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(review.id, review.name)}
                      className="text-xs text-gray-400 hover:text-red-600 p-2 transition-colors rounded hover:bg-red-50"
                      title="Hapus ulasan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
