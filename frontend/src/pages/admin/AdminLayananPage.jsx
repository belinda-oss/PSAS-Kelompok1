import AOS from 'aos';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Search, Plus, Pencil, X, Check } from 'lucide-react';

const INITIAL_SERVICES = [
  {
    id: 1,
    title: 'Eyebrow & Lip Embroidery',
    price: 'From $150',
    description:
      'Wake up effortlessly beautiful with our semi-permanent makeup solutions. Precision techniques for natural-looking enhancement.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    status: 'Aktif',
    isVisible: true,
  },
  {
    id: 2,
    title: 'Eyelash Extension',
    price: 'From $80',
    description:
      'Customized lash designs tailored to your eye shape. Choose from classic, volume, or hybrid sets for the perfect flutter.',
    image:
      'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    status: 'Aktif',
    isVisible: true,
  },
  {
    id: 3,
    title: 'Nail Art (Motif, Plain, 3D)',
    price: 'From $45',
    description:
      'Express your style with our premium manicure services. Featuring intricate motifs, classic solids, and stunning 3D designs.',
    image:
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    status: 'Aktif',
    isVisible: true,
  },
  {
    id: 4,
    title: 'Foot Spa',
    price: 'From $60',
    description:
      'A rejuvenating retreat for your feet. Includes deep exfoliation, soothing massage, and a restorative hydrating mask.',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    status: 'Aktif',
    isVisible: true,
  },
];

export default function AdminLayananPage() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: false });
    AOS.refresh();
  }, []);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    status: 'Aktif',
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      image:
        'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingService(item);
    setFormData({
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.image,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s))
      );
      showToast(`Layanan "${formData.title}" berhasil diperbarui`);
    } else {
      const newService = {
        id: Date.now(),
        ...formData,
        isVisible: true,
      };
      setServices((prev) => [newService, ...prev]);
      showToast(`Layanan baru "${formData.title}" berhasil ditambahkan`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast(`Layanan "${title}" telah dihapus`);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2421] text-white text-xs px-5 py-3 rounded-sm shadow-xl flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div data-aos="fade-up">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1f2421] tracking-wide mb-2.5">
          Katalog Layanan &amp; Harga
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Kelola daftar perawatan salon, durasi pengerjaan, dan harga yang tampil di website.
        </p>
      </div>

      {/* Actions Row */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#1f2421] text-white text-xs px-5 py-2.5 rounded-none font-medium uppercase tracking-widest hover:bg-[#c49a6c] active:scale-[0.99] transition-all self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Layanan Baru</span>
        </button>

        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs text-gray-800 placeholder:text-gray-400 bg-transparent border border-gray-200 rounded-full w-full sm:w-64 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {filteredServices.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">
            Tidak ada layanan yang ditemukan untuk "{searchQuery}".
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <div
              key={service.id}
              data-aos="fade-up"
              data-aos-delay={Math.min((index % 2) * 120, 240)}
              data-aos-duration="550"
              className="bg-white border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:border-[#e8ded2] transition-all duration-300"
            >
              {/* Image Container with Badge */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {service.isVisible && (
                  <div className="absolute top-3.5 right-3.5 bg-[#1f2421]/85 backdrop-blur-sm text-white text-[10px] tracking-wide font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Tampil di Web</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title & Price */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h2 className="font-serif text-xl font-normal text-[#1f2421] tracking-wide">
                      {service.title}
                    </h2>
                    <span className="text-xs sm:text-sm font-light text-[#d4af37] font-serif italic shrink-0">
                      {service.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-gray-400 font-medium">
                    STATUS: <span className="text-[#1f2421] font-semibold">{service.status}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(service)}
                      className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#b08556] font-medium transition-colors group/edit"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-500 group-hover/edit:text-[#c49a6c] transition-colors" />
                      <span>Edit Layanan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id, service.title)}
                      className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="modal-close-btn"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="modal-content">
              <h3 className="font-serif text-xl font-medium text-[#1f2421] tracking-wide mb-1">
                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <p className="text-xs text-gray-400 font-light mb-6">
                Perubahan akan langsung terlihat pada etalase website Shofi Eyelash.
              </p>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    NAMA LAYANAN
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Russian Volume Eyelash"
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    HARGA
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Contoh: From $80 atau Rp 250.000"
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    URL GAMBAR
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    DESKRIPSI LAYANAN
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat perawatan..."
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all rounded-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#1f2421] hover:border-[#1f2421] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1f2421] text-white hover:bg-[#c49a6c] transition-colors font-medium"
                  >
                    Simpan Layanan
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
