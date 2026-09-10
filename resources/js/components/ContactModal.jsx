import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-100 animate-slideUp">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-nude uppercase">PT GSU</span>
                        <h3 className="font-serif text-xl font-bold text-charcoal">Hubungi Kami</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-full transition"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {submitted ? (
                        <div className="py-8 text-center space-y-3">
                            <div className="w-14 h-14 mx-auto bg-green-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="font-serif text-xl font-bold text-charcoal">Pesan Terkirim</h4>
                            <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                Terima kasih telah menghubungi PT GSU. Kami akan segera merespons melalui email/WhatsApp Anda.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-[#f9fafb] rounded border border-gray-100 text-xs">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone size={16} className="text-nude flex-shrink-0" />
                                    <span>+62 xxx - xxxx - xxxx</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail size={16} className="text-nude flex-shrink-0" />
                                    <span>gsuexample@gmail.com</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Nama Lengkap *
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nama Anda"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Email / No. WhatsApp *
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@anda.com atau +628..."
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                                        Pesan atau Pertanyaan *
                                    </label>
                                    <textarea 
                                        rows={3} 
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Bagaimana kami dapat membantu Anda?"
                                        className="w-full p-3 text-sm border border-gray-200 rounded focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition resize-none"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-3 px-6 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-widest uppercase rounded transition flex items-center justify-center gap-2"
                                >
                                    <Send size={15} />
                                    <span>KIRIM PESAN</span>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
