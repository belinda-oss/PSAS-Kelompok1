import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, X, Check, Trash2, Eye, EyeOff, ImagePlus, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchAllExamples,
  createExample,
  updateExample,
  toggleExampleVisibility,
  deleteExample,
} from '../../services/nailArtService';

const DESIGN_IDS = [
  'blush_jelly',
  'french_gold',
  'aurora_glaze',
  'sakura_floral',
  'starry_night',
  'ruby_velvet',
  'cute_doodle',
  'rose_foil',
];

const EMPTY_FORM = {
  name: '',
  slug: '',
  category: '',
  design_id: '',
  description: '',
  engine: 'YOLOv8 + MediaPipe',
  is_active: true,
  sort_order: 0,
};

function slugify(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function AdminNailArtPage() {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExample, setEditingExample] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchAllExamples();
      setExamples(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load nail art examples:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('gsu_nail_art_examples_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('gsu_nail_art_examples_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const resetModal = () => {
    setEditingExample(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleOpenAdd = () => {
    resetModal();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingExample(item);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
      category: item.category || '',
      design_id: item.design_id || '',
      description: item.description || '',
      engine: item.engine || 'YOLOv8 + MediaPipe',
      is_active: item.is_active !== false,
      sort_order: item.sort_order ?? 0,
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setIsModalOpen(true);
  };

  const handleNameChange = (value) => {
    setFormData((prev) => {
      const shouldSyncSlug = !prev.slug || prev.slug === slugify(prev.name);
      return {
        ...prev,
        name: value,
        slug: shouldSyncSlug ? slugify(value) : prev.slug,
      };
    });
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Silakan pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || slugify(formData.name),
      category: formData.category.trim(),
      design_id: formData.design_id.trim(),
      description: formData.description.trim(),
      engine: formData.engine.trim() || 'YOLOv8 + MediaPipe',
      is_active: formData.is_active ? 1 : 0,
      sort_order: Number(formData.sort_order) || 0,
    };

    try {
      if (editingExample) {
        await updateExample(editingExample.id, payload, imageFile);
        showToast(`Contoh "${payload.name}" berhasil diperbarui.`);
      } else {
        await createExample(payload, imageFile);
        showToast(`Contoh baru "${payload.name}" berhasil ditambahkan.`);
      }
      await loadData();
      setIsModalOpen(false);
      resetModal();
    } catch (err) {
      console.error('Error saving nail art example:', err);
      showToast(err.message || 'Gagal menyimpan contoh nail art.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await toggleExampleVisibility(item.id);
      await loadData();
      showToast(
        item.is_active
          ? `Contoh "${item.name}" disembunyikan dari katalog publik.`
          : `Contoh "${item.name}" kini tampil di katalog publik.`
      );
    } catch (err) {
      showToast(err.message || 'Gagal mengubah status contoh.');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus contoh "${item.name}"?`)) return;
    try {
      await deleteExample(item.id);
      await loadData();
      showToast(`Contoh "${item.name}" telah dihapus.`);
    } catch (err) {
      showToast(err.message || 'Gagal menghapus contoh.');
    }
  };

  const filteredExamples = examples.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.design_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = examples.filter((item) => item.is_active).length;
  const withImageCount = examples.filter((item) => item.image_url).length;

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
          Contoh Nail Art AI
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light">
          Kelola gambar contoh nail art untuk engine generator kuku (YOLOv8 + MediaPipe). Contoh aktif akan dipakai sebagai referensi motif.
        </p>
      </motion.div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'TOTAL CONTOH', value: examples.length, suffix: 'gambar' },
          { label: 'TAMPIL DI KATALOG', value: activeCount, suffix: 'aktif' },
          { label: 'SUDAH ADA GAMBAR', value: withImageCount, suffix: 'file' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
            className="border border-gray-100 bg-white p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <p className="text-[10px] tracking-[0.2em] font-semibold text-gray-400 uppercase mb-3">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1f2421] tracking-wide">
                {stat.value}
              </span>
              <span className="text-xs text-gray-400 font-light">{stat.suffix}</span>
            </div>
          </motion.div>
        ))}
      </div>

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
          <span>Tambah Contoh Nail Art</span>
        </button>

        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, kategori, design id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs text-gray-800 placeholder:text-gray-400 bg-white border border-gray-200 rounded-full w-full sm:w-72 focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.12)] transition-all"
          />
        </div>
      </motion.div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400 rounded-2xl">
            Memuat contoh nail art...
          </div>
        ) : filteredExamples.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl">
            Tidak ada contoh yang ditemukan untuk "{searchQuery}".
          </div>
        ) : (
          filteredExamples.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: 'easeOut' }}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-[#e8ded2] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5">
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-[10px] tracking-widest uppercase">Belum ada gambar</span>
                  </div>
                )}
                {item.is_active ? (
                  <div className="absolute top-3 right-3 bg-[#1f2421]/90 backdrop-blur-sm text-white text-[10px] tracking-wide font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Tampil</span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-[10px] tracking-wide font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span>Disembunyikan</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h2 className="font-serif text-lg font-normal text-[#1f2421] tracking-wide leading-snug">
                      {item.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase tracking-wider bg-[#f9f7f4] border border-[#e8ded2] text-[#8a6d47] px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    {item.design_id && (
                      <span className="text-[10px] font-mono bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                        {item.design_id}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">
                    {item.description || 'Belum ada deskripsi.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2">
                    <Cpu className="w-3 h-3" />
                    <span>{item.engine || 'YOLOv8 + MediaPipe'}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                      item.is_active
                        ? 'border border-gray-300 text-gray-700 bg-white hover:border-[#c49a6c]'
                        : 'bg-[#1f2421] text-white hover:bg-emerald-700'
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tampilkan</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#b08556] font-medium transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-xs text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Hapus Contoh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative rounded-3xl">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetModal(); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-medium text-[#1f2421] tracking-wide mb-1">
              {editingExample ? 'Edit Contoh Nail Art' : 'Tambah Contoh Nail Art'}
            </h3>
            <p className="text-xs text-gray-400 font-light mb-6">
              Gambar contoh akan dipakai sebagai referensi motif oleh engine YOLOv8 + MediaPipe.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                  GAMBAR CONTOH
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-xs text-gray-700 hover:border-[#c49a6c] cursor-pointer transition-colors">
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Pilih Gambar</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                      />
                    </label>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WEBP. Maks 4 MB.</p>
                    {editingExample && (
                      <p className="text-[10px] text-gray-400">Biarkan kosong untuk mempertahankan gambar lama.</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                  NAMA CONTOH
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Korean Blush Jelly"
                  className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    SLUG
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="contoh_blush_jelly"
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    KATEGORI
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Cute & Kawaii"
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    DESIGN ID (AI)
                  </label>
                  <input
                    type="text"
                    list="nail-design-ids"
                    value={formData.design_id}
                    onChange={(e) => setFormData({ ...formData, design_id: e.target.value })}
                    placeholder="blush_jelly"
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl font-mono"
                  />
                  <datalist id="nail-design-ids">
                    {DESIGN_IDS.map((id) => (
                      <option key={id} value={id} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                    URUTAN
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                  ENGINE GENERATOR
                </label>
                <input
                  type="text"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-gray-600 uppercase mb-1.5">
                  DESKRIPSI
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat contoh nail art..."
                  className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#c49a6c] transition-all rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4 bg-[#fbfbfb] border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-800">Tampilkan di katalog publik</p>
                  <p className="text-[10px] text-gray-400 font-light">Contoh aktif dapat dipakai engine generator.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_active}
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.is_active ? 'bg-[#1f2421]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formData.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetModal(); }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#1f2421] rounded-full transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#1f2421] text-white hover:bg-[#c49a6c] rounded-full transition-colors font-medium tracking-wide uppercase text-[11px] disabled:opacity-60"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Contoh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
