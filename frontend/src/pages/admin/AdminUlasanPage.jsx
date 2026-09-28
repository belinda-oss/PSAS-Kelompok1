import React, { useState, useEffect } from 'react';
import { Search, Star, Check } from 'lucide-react';
import AOS from 'aos';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Sarah Wijaya',
    rating: 5,
    comment: 'Hasilnya sangat natural dan tahan lama. Teknisi sangat profesional!',
    date: '2 hari yang lalu',
    isVisible: true,
  },
  {
    id: 2,
    name: 'Amanda Putri',
    rating: 5,
    comment: 'Tempatnya sangat nyaman dan bersih. Sangat merekomendasikan Shofi Eyelash.',
    date: '1 minggu yang lalu',
    isVisible: true,
  },
  {
    id: 3,
    name: 'Rina Kartika',
    rating: 5,
    comment: 'Volume set-nya juara! Mata jadi terlihat lebih hidup tapi tetap ringan.',
    date: '2 minggu yang lalu',
    isVisible: true,
  },
];

export default function AdminUlasanPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
    AOS.refresh();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleToggleVisibility = (id) => {
    setReviews((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isVisible;
          showToast(
            nextState
              ? `Ulasan dari ${item.name} kini tampil di website`
              : `Ulasan dari ${item.name} disembunyikan`
          );
          return { ...item, isVisible: nextState };
        }
        return item;
      })
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus ulasan dari ${name}?`)) {
      setReviews((prev) => prev.filter((item) => item.id !== id));
      showToast(`Ulasan dari ${name} berhasil dihapus`);
    }
  };

  const filteredReviews = reviews.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 font-sans">
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
          Manajemen Ulasan &amp; Kepuasan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Feedback pengunjung website Shofi Eyelash untuk etalase testimoni terkurasi.
        </p>
      </div>

      {/* Statistics Row (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1 */}
        <div
          data-aos="fade-up"
          data-aos-delay="0"
          className="border border-gray-100 bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#e8ded2]"
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            TOTAL ULASAN MASUK
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
              312
            </span>
            <span className="text-xs text-gray-400 font-light">testimoni</span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="border border-gray-100 bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#e8ded2]"
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            RATA-RATA BINTANG
          </p>
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
              4.9
            </span>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs text-gray-400 font-light">dari 5.0</span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="border border-gray-100 bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#e8ded2]"
        >
          <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
            ULASAN BARU BELUM DIBALAS
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
              5
            </span>
            <span className="text-xs text-gray-400 font-light">menunggu respons</span>
          </div>
        </div>
      </div>

      {/* Reviews List Section */}
      <div className="pt-2">
        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
          data-aos="fade-up"
        >
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1f2421] tracking-wide">
              Ulasan Pengunjung Terbaru
            </h2>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Daftar moderasi langsung untuk tayangan website
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
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-5">
          {filteredReviews.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400 border border-dashed border-gray-200">
              Tidak ada ulasan yang cocok dengan pencarian "{searchQuery}".
            </div>
          ) : (
            filteredReviews.map((review, index) => (
              <div
                key={review.id}
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 60, 300)}
                data-aos-duration="550"
                className="bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[#e8ded2]"
              >
                {/* Content */}
                <div className="flex-1 space-y-2 max-w-3xl">
                  {/* Author & Meta */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="font-serif text-sm font-normal text-[#1f2421]">{review.name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400 font-light">{review.date}</span>
                    <div className="flex items-center gap-0.5 text-amber-400 ml-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-[13px] text-gray-600 font-light leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(review.id)}
                    className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                      review.isVisible
                        ? 'bg-[#1f2421] text-white hover:bg-[#c49a6c]'
                        : 'border border-gray-300 text-gray-700 bg-transparent hover:border-[#c49a6c] hover:text-[#b08556]'
                    }`}
                  >
                    {review.isVisible ? 'Tampil di Web' : 'Sembunyikan'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(review.id, review.name)}
                    className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
