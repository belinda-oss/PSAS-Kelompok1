import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, X, Check, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchAllServices,
  createService,
  updateService,
  toggleServiceVisibility,
  deleteService,
} from '../../services/servicesService';

export default function AdminLayananPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const loadData = async () => {
    try {
      const data = await fetchAllServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('gsu_services_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gsu_services_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
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
      status: item.status || (item.is_active ? 'Aktif' : 'Nonaktif'),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        showToast(`Layanan "${formData.title}" berhasil diperbarui.`);
      } else {
        await createService(formData);
        showToast(`Layanan baru "${formData.title}" berhasil ditambahkan.`);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      showToast('Gagal menyimpan layanan.');
    }
  };

  const handleToggleVisibility = async (service) => {
    const isNowActive = await toggleServiceVisibility(service.id);
    await loadData();
    showToast(
      isNowActive
        ? `Layanan "${service.title}" kini tampil di website publik.`
        : `Layanan "${service.title}" disembunyikan dari website publik.`
    );
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) {
      await deleteService(id);
      await loadData();
      showToast(`Layanan "${title}" telah dihapus.`);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Katalog Layanan &amp; Harga
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Kelola daftar perawatan salon Shofi Eyelash yang tampil di etalase website publik.
        </p>
      </motion.div>

      {/* Actions Row */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#1f2421] text-white text-xs px-5 py-2.5 rounded-full font-medium uppercase tracking-widest hover:bg-[#c49a6c] active:scale-[0.99] transition-all self-start shadow-sm"
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
            className="pl-9 pr-4 py-2 text-xs text-gray-800 placeholder:text-gray-400 bg-white border border-gray-200 rounded-full w-full sm:w-64 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all"
          />
        </div>
      </motion.div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400 rounded-2xl">
            Memuat daftar layanan...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl">
            Tidak ada layanan yang ditemukan untuk "{searchQuery}".
          </div>
        ) : (
          filteredServices.map((service, index) => {
            const isShown = service.is_active !== false && service.status !== 'Nonaktif';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.12, ease: 'easeOut' }}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-[#e8ded2] transition-all duration-300"
              >
                {/* Image Container with Badge */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {isShown ? (
                    <div className="absolute top-3.5 right-3.5 bg-[#1f2421]/90 backdrop-blur-sm text-white text-[10px] tracking-wide font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Tampil di Web</span>
                    </div>
                  ) : (
                    <div className="absolute top-3.5 right-3.5 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-[10px] tracking-wide font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span>Disembunyikan</span>
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
                      <span className="text-xs sm:text-sm font-semibold text-[#b08556] font-serif shrink-0">
                        {service.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(service)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                        isShown
                          ? 'border border-gray-300 text-gray-700 bg-white hover:border-[#c49a6c]'
                          : 'bg-[#1f2421] text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isShown ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tampilkan di Web</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(service)}
                        className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#b08556] font-medium transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service.id, service.title)}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Hapus Layanan"
                      >
<Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                </motion.div>
              );
            })
          )}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative rounded-3xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#1f2421] tracking-wide mb-1">
                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <p className="text-xs text-gray-400 font-light mb-6">
                Perubahan akan langsung tersimpan dan dapat disinkronkan ke etalase publik.
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
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
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
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
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
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
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
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#1f2421] rounded-full transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1f2421] text-white hover:bg-[#c49a6c] rounded-full transition-colors font-medium tracking-wide uppercase text-[11px]"
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
