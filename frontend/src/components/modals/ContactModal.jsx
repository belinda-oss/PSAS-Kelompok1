import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Clock, Scissors, Package, MessageCircle, ChevronDown } from 'lucide-react';
import { getContactSettings, buildWALink } from '../../hooks/useContactSettings';

// ─── Departemen ──────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    {
        id: 'beauty',
        label: 'Admin Jasa Kecantikan',
        sublabel: 'Shofi Eyelash — Reservasi & layanan salon',
        icon: Scissors,
        accent: '#c49a6c',
        waKey: 'waBeauty',
        defaultMsg: (name) =>
            `Halo Admin Shofi Eyelash! 👋\n\nSaya *${name || 'Pelanggan'}* ingin menanyakan informasi / melakukan reservasi layanan kecantikan.\n\nMohon bantuannya, terima kasih!`,
    },
    {
        id: 'distributor',
        label: 'Admin Distributor / Owner',
        sublabel: 'PT GSU — Distribusi & kemitraan bisnis',
        icon: Package,
        accent: '#1f2421',
        waKey: 'waDistributor',
        defaultMsg: (name) =>
            `Halo Admin GSU Distribution! 👋\n\nSaya *${name || 'Mitra'}* ingin mengetahui informasi distribusi / kemitraan bisnis.\n\nMohon bantuannya, terima kasih!`,
    },
];

// ─── Jam Operasional ──────────────────────────────────────────────────────────
const OPERATING_HOURS = [
    { day: 'Senin – Jumat', hours: '09.00 – 20.00 WIB' },
    { day: 'Sabtu', hours: '09.00 – 19.00 WIB' },
    { day: 'Minggu / Libur', hours: '10.00 – 17.00 WIB' },
];

export default function ContactModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [department, setDepartment] = useState('beauty');
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [contacts, setContacts] = useState({ waBeauty: '', waDistributor: '' });

    // Baca nomor WA dari localStorage setiap kali modal dibuka
    useEffect(() => {
        if (isOpen) {
            setContacts(getContactSettings());
            // Reset form
            setName('');
            setEmail('');
            setMessage('');
            setDepartment('beauty');
            setIsDeptOpen(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedDept = DEPARTMENTS.find((d) => d.id === department);
    const DeptIcon = selectedDept.icon;

    const handleSendWA = (e) => {
        e.preventDefault();
        const waNumber = contacts[selectedDept.waKey];
        const msgText =
            message.trim() ||
            selectedDept.defaultMsg(name);

        // Tambahkan nama & email ke pesan jika diisi
        const fullMsg = [
            message.trim()
                ? `${selectedDept.defaultMsg(name)}\n\n*Pesan:*\n${message.trim()}`
                : selectedDept.defaultMsg(name),
            email.trim() ? `\n📧 Email saya: ${email.trim()}` : '',
        ]
            .join('')
            .trim();

        const url = buildWALink(waNumber, fullMsg);
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Hubungi Kami"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
                <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 pointer-events-auto animate-slideUp">

                    {/* ── Header ─────────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                        <div>
                            <span className="text-[10px] font-semibold tracking-[0.22em] text-[#c49a6c] uppercase">PT GSU</span>
                            <h3 className="font-serif text-xl font-bold text-[#1f2421]">Hubungi Kami</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-[#1f2421] hover:bg-gray-100 rounded-full transition"
                            aria-label="Tutup"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

                        {/* ── Info Cards: Jam & Kontak ───────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Jam Operasional */}
                            <div className="bg-[#f9fafb] rounded-2xl p-3.5 border border-gray-100 space-y-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock size={13} className="text-[#c49a6c]" />
                                    <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Jam Operasional</span>
                                </div>
                                {OPERATING_HOURS.map((op) => (
                                    <div key={op.day} className="flex justify-between items-baseline gap-2">
                                        <span className="text-[11px] text-gray-500">{op.day}</span>
                                        <span className="text-[11px] font-medium text-[#1f2421] whitespace-nowrap">{op.hours}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Kontak per Departemen */}
                            <div className="bg-[#f9fafb] rounded-2xl p-3.5 border border-gray-100 space-y-2.5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Phone size={13} className="text-[#c49a6c]" />
                                    <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Kontak Langsung</span>
                                </div>
                                {DEPARTMENTS.map((dept) => {
                                    const Icon = dept.icon;
                                    return (
                                        <div key={dept.id} className="flex items-start gap-2">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ backgroundColor: `${dept.accent}18` }}
                                            >
                                                <Icon size={11} style={{ color: dept.accent }} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-gray-700">{dept.label}</p>
                                                <p className="text-[11px] text-gray-500">{contacts[dept.waKey] || '—'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="flex items-start gap-2 pt-1 border-t border-gray-100">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
                                        <Mail size={11} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-700">Email Umum</p>
                                        <p className="text-[11px] text-gray-500">info@ptgsu.co.id</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Form ──────────────────────────────────────────── */}
                        <form onSubmit={handleSendWA} className="space-y-4">

                            {/* Pilih Departemen */}
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                                    Hubungi Departemen *
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeptOpen(!isDeptOpen)}
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#fbfbfb] border border-gray-200 rounded-xl text-left focus:outline-none focus:border-[#c49a6c] focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${selectedDept.accent}18` }}
                                            >
                                                <DeptIcon size={13} style={{ color: selectedDept.accent }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-[#1f2421]">{selectedDept.label}</p>
                                                <p className="text-[10px] text-gray-400">{selectedDept.sublabel}</p>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            size={15}
                                            className={`text-gray-400 transition-transform duration-200 ${isDeptOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Dropdown options */}
                                    {isDeptOpen && (
                                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                                            {DEPARTMENTS.map((dept) => {
                                                const Icon = dept.icon;
                                                const isActive = dept.id === department;
                                                return (
                                                    <button
                                                        key={dept.id}
                                                        type="button"
                                                        onClick={() => { setDepartment(dept.id); setIsDeptOpen(false); }}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                            isActive
                                                                ? 'bg-[#fbfbfb] text-[#1f2421]'
                                                                : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                    >
                                                        <div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                                            style={{ backgroundColor: `${dept.accent}18` }}
                                                        >
                                                            <Icon size={14} style={{ color: dept.accent }} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold">{dept.label}</p>
                                                            <p className="text-[10px] text-gray-400">{dept.sublabel}</p>
                                                        </div>
                                                        {isActive && (
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: dept.accent }}
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama Anda"
                                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbfbfb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all placeholder:text-gray-300"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="contact-email" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                                    Email
                                    <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(opsional)</span>
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbfbfb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all placeholder:text-gray-300"
                                />
                            </div>

                            {/* Pesan */}
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                                    Pesan / Pertanyaan
                                    <span className="ml-1 text-gray-300 normal-case tracking-normal font-normal">(opsional — akan kami siapkan template)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tuliskan pertanyaan atau keperluan Anda..."
                                    className="w-full px-3.5 py-2.5 text-sm bg-[#fbfbfb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#c49a6c] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,154,108,0.10)] transition-all resize-none placeholder:text-gray-300"
                                />
                            </div>

                            {/* Tombol Kirim via WA */}
                            <button
                                type="submit"
                                className="w-full py-3 px-6 flex items-center justify-center gap-2 rounded-full text-white text-xs font-semibold tracking-widest uppercase transition-all active:scale-[0.98] shadow-sm"
                                style={{ backgroundColor: selectedDept.accent }}
                            >
                                <MessageCircle size={15} />
                                <span>Kirim via WhatsApp</span>
                            </button>

                            <p className="text-center text-[10px] text-gray-400 leading-relaxed">
                                Pesan Anda akan diteruskan langsung ke{' '}
                                <span className="font-semibold text-gray-600">{selectedDept.label}</span>{' '}
                                melalui WhatsApp.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
