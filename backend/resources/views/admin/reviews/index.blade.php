<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moderasi Ulasan Pelanggan - Admin Panel</title>
    <!-- Tailwind CSS CDN for quick admin styling -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans text-gray-800 antialiased min-h-screen">
    
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Moderasi Ulasan Pelanggan</h1>
                <p class="text-sm text-gray-500 mt-1">Kelola dan setujui ulasan yang masuk sebelum ditampilkan ke publik.</p>
            </div>
            <div class="mt-4 md:mt-0 text-sm text-gray-600">
                Total Ulasan: <span class="font-bold text-gray-900">{{ $counts['all'] }}</span>
            </div>
        </div>

        <!-- Success Alert -->
        @if(session('success'))
            <div class="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm flex items-center justify-between">
                <span>{{ session('success') }}</span>
                <button onclick="this.parentElement.remove()" class="text-green-600 hover:text-green-900 font-bold">&times;</button>
            </div>
        @endif

        <!-- Filter Tabs -->
        <div class="flex items-center space-x-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
            <a href="{{ route('admin.reviews.index', ['status' => 'all']) }}" 
               class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $status === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300' }}">
                Semua <span class="ml-1.5 px-2 py-0.5 text-xs rounded-full {{ $status === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600' }}">{{ $counts['all'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'pending']) }}" 
               class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $status === 'pending' ? 'bg-amber-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300' }}">
                Menunggu (Pending) <span class="ml-1.5 px-2 py-0.5 text-xs rounded-full {{ $status === 'pending' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800' }}">{{ $counts['pending'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'published']) }}" 
               class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $status === 'published' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300' }}">
                Diterbitkan <span class="ml-1.5 px-2 py-0.5 text-xs rounded-full {{ $status === 'published' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800' }}">{{ $counts['published'] }}</span>
            </a>

            <a href="{{ route('admin.reviews.index', ['status' => 'rejected']) }}" 
               class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $status === 'rejected' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300' }}">
                Ditolak <span class="ml-1.5 px-2 py-0.5 text-xs rounded-full {{ $status === 'rejected' ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800' }}">{{ $counts['rejected'] }}</span>
            </a>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-xs">
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
                    <tbody class="divide-y divide-gray-200 text-gray-700">
                        @forelse($reviews as $review)
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="py-3.5 px-4 font-mono text-xs text-gray-500">#{{ $review->id }}</td>
                                <td class="py-3.5 px-4 font-medium text-gray-900">{{ $review->name }}</td>
                                <td class="py-3.5 px-4">
                                    <div class="flex items-center text-amber-500 font-bold">
                                        <span>★ {{ $review->rating }}</span>
                                        <span class="text-xs text-gray-400 font-normal ml-1">/5</span>
                                    </div>
                                </td>
                                <td class="py-3.5 px-4 max-w-xs md:max-w-md">
                                    <p class="line-clamp-2 text-gray-800 whitespace-pre-line" title="{{ $review->comment }}">{{ $review->comment }}</p>
                                </td>
                                <td class="py-3.5 px-4">
                                    @if($review->status === 'published')
                                        <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Published</span>
                                    @elseif($review->status === 'rejected')
                                        <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                                    @else
                                        <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Pending</span>
                                    @endif
                                </td>
                                <td class="py-3.5 px-4 text-xs text-gray-500">
                                    {{ $review->created_at ? $review->created_at->format('d M Y, H:i') : '-' }}
                                </td>
                                <td class="py-3.5 px-4 text-xs text-gray-500">
                                    {{ $review->published_at ? $review->published_at->format('d M Y, H:i') : '-' }}
                                </td>
                                <td class="py-3.5 px-4 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        @if($review->status !== 'published')
                                            <form action="{{ route('admin.reviews.publish', $review->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" onclick="return confirm('Terbitkan ulasan ini?')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
                                                    Terbitkan
                                                </button>
                                            </form>
                                        @endif

                                        @if($review->status !== 'rejected')
                                            <form action="{{ route('admin.reviews.reject', $review->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" onclick="return confirm('Tolak ulasan ini?')" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
                                                    Tolak
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="py-8 px-4 text-center text-gray-500">
                                    Tidak ada ulasan ditemukan untuk filter status saat ini.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($reviews->hasPages())
                <div class="p-4 border-t border-gray-200 bg-gray-50">
                    {{ $reviews->links() }}
                </div>
            @endif
        </div>

    </div>

</body>
</html>
