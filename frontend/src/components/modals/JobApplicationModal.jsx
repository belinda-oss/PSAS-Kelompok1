import React, { useState } from 'react';
import { X, CheckCircle2, Send, Briefcase, Mail, Phone, User, FileText } from 'lucide-react';

export default function JobApplicationModal({ isOpen, onClose, initialRole = 'Superteam PT GSU' }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: initialRole,
        experience: '1-3 Tahun',
        portfolio: '',
        coverLetter: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2500);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-100 animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-nude uppercase">Careers</span>
                        <h3 className="font-serif text-xl font-bold text-charcoal">Apply for {formData.position || 'Superteam'}</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-full transition"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {isSuccess ? (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={36} />
                            </div>
                            <h4 className="font-serif text-2xl font-bold text-charcoal">Lamaran Terkirim!</h4>
                            <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                Terima kasih telah melamar. Tim HRD PT GSU akan meninjau kualifikasi Anda dan menghubungi via WhatsApp/Email.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                    Nama Lengkap *
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Contoh: Amanda Putri"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input 
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="nama@email.com"
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        No. WhatsApp / HP *
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input 
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+62 812-xxxx-xxxx"
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Posisi yang Dilamar
                                    </label>
                                    <div className="relative">
                                        <Briefcase size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <select
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition bg-white"
                                        >
                                            <option value="Senior Eyelash Artist">Senior Eyelash Artist</option>
                                            <option value="Nail Art Specialist">Nail Art Specialist</option>
                                            <option value="Logistics & Warehouse Staff">Logistics & Warehouse Staff</option>
                                            <option value="Supply Chain Coordinator">Supply Chain Coordinator</option>
                                            <option value="Digital Marketing & Social Media">Digital Marketing & Social Media</option>
                                            <option value="Internship Program (Magang KMP)">Internship Program (Magang KMP)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Pengalaman Kerja
                                    </label>
                                    <select
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition bg-white"
                                    >
                                        <option value="Fresh Graduate / Magang">Fresh Graduate / Magang</option>
                                        <option value="1-3 Tahun">1-3 Tahun</option>
                                        <option value="3-5 Tahun">3-5 Tahun</option>
                                        <option value="> 5 Tahun">&gt; 5 Tahun</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                    Tautan Portofolio / LinkedIn / CV (Google Drive)
                                </label>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="url"
                                        value={formData.portfolio}
                                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                        placeholder="https://linkedin.com/in/... atau link drive"
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                    Pesan Singkat / Mengapa Ingin Bergabung?
                                </label>
                                <textarea 
                                    rows={3}
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    placeholder="Ceritakan minat dan keahlian utama Anda..."
                                    className="w-full p-3 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full mt-2 py-3 px-6 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-widest uppercase rounded transition flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span>Mengirimkan Lamaran...</span>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        <span>KIRIM LAMARAN</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
