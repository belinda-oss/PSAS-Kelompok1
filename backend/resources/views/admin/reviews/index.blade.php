<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderasi Ulasan Pelanggan - Admin Panel</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN for quick admin styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- AOS Animations (same library as PT GSU website) -->
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        charcoal: { DEFAULT: '#1f2421', light: '#3a3f3c', dark: '#141414' },
                        nude: { DEFAULT: '#c49a6c', hover: '#b08556', light: '#faf5ee', muted: '#e8ded2' },
                        gold: '#d4af37',
                        offwhite: '#fbfbfb',
                    },
                    fontFamily: {
                        serif: ['Lora', 'Playfair Display', 'Georgia', 'serif'],
                        sans: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                    },
                },
            },
        };
    </script>
    <style>
        .header-underline {
            position: relative;
        }
        .header-underline::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            height: 2px;
            background-color: #1f2421;
            transition: width 0.3s ease;
            width: 0;
        }
        .header-underline:hover::after {
            width: 100%;
        }
        .tab-active {
            box-shadow: inset 0 -2px 0 #1f2421;
        }
    </style>
</head>
<body class="bg-offwhite font-sans text-charcoal antialiased min-h-screen">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <!-- Sticky Header -->
        <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-6 sm:px-8 bg-[#fbfbfb]/95 backdrop-blur-md border-b border-black/5 mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between py-5">
                <div data-aos="fade-right">
                    <h1 class="font-serif text-2xl md:text-3xl font-normal text-charcoal tracking-wide">Moderasi Ulasan Pelanggan</h1>
                    <p class="text-xs text-gray-500 mt-1">Kelola dan setujui ulasan yang masuk sebelum ditampilkan ke publik.</p>
                </div>
                <div class="mt-3 md:mt-0 text-xs text-gray-500" data-aos="fade-left" data-aos-delay="100">
                    Total Ulasan: <span class="font-bold text-charcoal">{{ $counts['all'] }}</span>
                </div>
            </div>
        </div>

        <!-- Success Alert -->
        @if(session('success'))
            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-800 text-sm flex items-center justify-between" data-aos="fade-down">
                <span>{{ session('success') }}</span>
                <button onclick="this.parentElement.remove()" class="text-green-600 hover:text-green-900 font-bold">&times;</button>
            </div>
        @endif

        <!-- Filter Tabs -->
        <div class="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto" data-aos="fade-up">
            <a href="{{ route('admin.reviews.index', ['status' => 'all']) }}"
               class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all group {{ $status === 'all' ? 'bg-charcoal text-white shadow-sm' : 'bg-transparent text-gray-600 hover:text-charcoal border border-gray-200 hover:border-charcoal' }}">
                Semua <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full {{ $status === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600' }}">{{ $counts['all'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'pending']) }}"
               class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all {{ $status === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:text-amber-600 border border-gray-200 hover:border-amber-400' }}">
                Menunggu (Pending) <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full {{ $status === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700' }}">{{ $counts['pending'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'published']) }}"
               class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all {{ $status === 'published' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-500' }}">
                Diterbitkan <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full {{ $status === 'published' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700' }}">{{ $counts['published'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'rejected']) }}"
               class="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all {{ $status === 'rejected' ? 'bg-red-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-500' }}">
                Ditolak <span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full {{ $status === 'rejected' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700' }}">{{ $counts['rejected'] }}</span>
            </a>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="bg-[#fbfbfb] text-gray-500 font-semibold border-b border-gray-100 uppercase text-[10px] tracking-[0.15em]">
                            <th class="py-3.5 px-4 w-16">ID</th>
                            <th class="py-3.5 px-4 w-44">Nama</th>
                            <th class="py-3.5 px-4 w-28">Rating</th>
                            <th class="py-3.5 px-4">Komentar</th>
                            <th class="py-3.5 px-4 w-28">Status</th>
                            <th class="py-3.5 px-4 w-36">Tgl Dibuat</th>
                            <th class="py-3.5 px-4 w-36">Tgl Terbit</th>
                            <th class="py-3.5 px-4 w-48 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-gray-700">
                        @forelse($reviews as $review)
                            <tr class="hover:bg-[#fbfbfb] transition-colors duration-200">
                                <td class="py-3.5 px-4 font-mono text-xs text-gray-400">#{{ $review->id }}</td>
                                <td class="py-3.5 px-4 font-medium text-charcoal">{{ $review->name }}</td>
                                <td class="py-3.5 px-4">
                                    <div class="flex items-center text-amber-400 font-bold">
                                        <span>★ {{ $review->rating }}</span>
                                        <span class="text-xs text-gray-400 font-normal ml-1">/5</span>
                                    </div>
                                </td>
                                <td class="py-3.5 px-4 max-w-xs md:max-w-md">
                                    <p class="line-clamp-2 text-gray-600 whitespace-pre-line" title="{{ $review->comment }}">{{ $review->comment }}</p>
                                </td>
                                <td class="py-3.5 px-4">
                                    @if($review->status === 'published')
                                        <span class="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700">Published</span>
                                    @elseif($review->status === 'rejected')
                                        <span class="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-red-100 text-red-700">Rejected</span>
                                    @else
                                        <span class="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700">Pending</span>
                                    @endif
                                </td>
                                <td class="py-3.5 px-4 text-xs text-gray-400">
                                    {{ $review->created_at ? $review->created_at->format('d M Y, H:i') : '-' }}
                                </td>
                                <td class="py-3.5 px-4 text-xs text-gray-400">
                                    {{ $review->published_at ? $review->published_at->format('d M Y, H:i') : '-' }}
                                </td>
                                <td class="py-3.5 px-4 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        @if($review->status !== 'published')
                                            <form action="{{ route('admin.reviews.publish', $review->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" onclick="return confirm('Terbitkan ulasan ini?')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition-all active:scale-[0.97]">
                                                    Terbitkan
                                                </button>
                                            </form>
                                        @endif

                                        @if($review->status !== 'rejected')
                                            <form action="{{ route('admin.reviews.reject', $review->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" onclick="return confirm('Tolak ulasan ini?')" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition-all active:scale-[0.97]">
                                                    Tolak
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="py-12 px-4 text-center text-gray-400 text-sm">
                                    Tidak ada ulasan ditemukan untuk filter status saat ini.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($reviews->hasPages())
                <div class="p-4 border-t border-gray-100 bg-[#fbfbfb]">
                    {{ $reviews->links() }}
                </div>
            @endif
        </div>

    </div>

    <script>
        AOS.init({ duration: 700, easing: 'ease-out-cubic', once: false, offset: 40 });
    </script>
</body>
</html>