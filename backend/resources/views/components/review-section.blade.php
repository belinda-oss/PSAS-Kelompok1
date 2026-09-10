@props(['reviews' => null])

@php
    // If $reviews is not passed, fetch published reviews directly
    if ($reviews === null) {
        $reviews = \App\Models\Review::where('status', 'published')
            ->latest('created_at')
            ->simplePaginate(6);
    }
@endphp

<!-- Tailwind Dark & Gold Customer Reviews 2-Column Section -->
<section class="w-full max-w-7xl mx-auto my-12 px-4 font-sans antialiased text-gray-100">
    
    <!-- Section Header -->
    <div class="text-center mb-10">
        <span class="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-[#c49a6c] bg-[#c49a6c]/10 border border-[#c49a6c]/30 rounded-full uppercase mb-3">
            Ulasan Pelanggan
        </span>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            Pengalaman & Tanggapan Klien
        </h2>
        <p class="text-gray-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Bagikan ulasan Anda atau lihat pengalaman pelanggan lain yang telah mencoba layanan kami.
        </p>
    </div>

    <!-- 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- LEFT COLUMN: Form Input Ulasan (lg:col-span-5) -->
        <div class="lg:col-span-5 bg-[#1a1a1a] border border-[#c49a6c]/30 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <h3 class="text-xl font-serif font-bold text-white mb-2">Tulis Ulasan Anda</h3>
            <p class="text-xs text-gray-400 mb-6">Ulasan Anda sangat berharga untuk meningkatkan kualitas layanan kami.</p>

            <!-- Success Alert (Session Flash or AJAX) -->
            @if(session('success'))
                <div class="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm flex items-start space-x-3">
                    <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ session('success') }}</span>
                </div>
            @endif

            <div id="ajax-success-alert" class="hidden mb-6 p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm flex items-start space-x-3">
                <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span id="ajax-success-msg">Ulasan kamu sedang ditinjau sebelum tampil.</span>
            </div>

            <!-- Error Alert -->
            <div id="review-error-alert" class="hidden mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm">
                <span id="review-error-msg"></span>
            </div>

            <!-- Review Form -->
            <form id="review-form" action="{{ route('reviews.store') }}" method="POST" class="space-y-5">
                @csrf

                <!-- Input Nama -->
                <div>
                    <label for="review-name" class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Nama Lengkap</label>
                    <input type="text" id="review-name" name="name" required max="100" placeholder="Masukkan nama Anda..." class="w-full px-4 py-3 bg-[#121212] border border-gray-800 focus:border-[#c49a6c] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors duration-200">
                </div>

                <!-- Input Rating Bintang Interaktif -->
                <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Beri Rating (1 - 5 Bintang)</label>
                    <div id="star-rating-container" class="flex items-center space-x-2 py-1 cursor-pointer">
                        @for($i = 1; $i <= 5; $i++)
                            <button type="button" data-rating="{{ $i }}" class="star-btn p-1 text-gray-600 hover:text-[#c49a6c] transition-colors focus:outline-none" aria-label="Bintang {{ $i }}">
                                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </button>
                        @endfor
                    </div>
                    <input type="hidden" id="rating-input" name="rating" value="5" required>
                    <p class="text-xs text-[#c49a6c] mt-1 font-medium" id="rating-text">5 Bintang (Sangat Memuaskan)</p>
                </div>

                <!-- Input Komentar -->
                <div>
                    <label for="review-comment" class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Komentar / Ulasan</label>
                    <textarea id="review-comment" name="comment" rows="4" required maxlength="1000" placeholder="Tuliskan pengalaman atau saran Anda..." class="w-full px-4 py-3 bg-[#121212] border border-gray-800 focus:border-[#c49a6c] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors duration-200 resize-none"></textarea>
                </div>

                <!-- Tombol Submit -->
                <button type="submit" id="submit-review-btn" class="w-full py-3.5 px-6 rounded-xl font-semibold text-charcoal bg-gradient-to-r from-[#c49a6c] via-[#d4b996] to-[#c49a6c] hover:from-[#b08556] hover:to-[#b08556] transition-all duration-300 shadow-md hover:shadow-[#c49a6c]/20 text-sm tracking-wider flex items-center justify-center space-x-2">
                    <span id="review-btn-text">Kirim Ulasan</span>
                    <svg id="review-btn-spinner" class="hidden animate-spin h-4 w-4 text-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </button>
            </form>
        </div>

        <!-- RIGHT COLUMN: Daftar Ulasan Published (lg:col-span-7) -->
        <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 class="text-xl font-serif font-bold text-white">Ulasan Terpublikasi</h3>
                <span class="text-xs text-[#c49a6c] bg-[#c49a6c]/10 px-3 py-1 rounded-full border border-[#c49a6c]/30">
                    Menampilkan ulasan terverifikasi
                </span>
            </div>

            @if($reviews->isEmpty())
                <div class="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
                    <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <p class="text-sm font-medium">Belum ada ulasan terpublikasi.</p>
                    <p class="text-xs text-gray-500 mt-1">Jadilah yang pertama memberikan tanggapan!</p>
                </div>
            @else
                <div class="space-y-4">
                    @foreach($reviews as $review)
                        <div class="bg-[#1a1a1a] border border-gray-800/80 hover:border-[#c49a6c]/40 rounded-xl p-5 shadow-lg transition-all duration-200">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center space-x-3">
                                    <div class="w-9 h-9 rounded-full bg-[#c49a6c]/20 border border-[#c49a6c]/40 flex items-center justify-center text-[#c49a6c] font-bold text-sm">
                                        {{ strtoupper(substr($review->name, 0, 1)) }}
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-bold text-white leading-tight">{{ $review->name }}</h4>
                                        <span class="text-[11px] text-gray-400">{{ $review->created_at ? $review->created_at->diffForHumans() : 'Baru saja' }}</span>
                                    </div>
                                </div>

                                <!-- Stars -->
                                <div class="flex items-center space-x-0.5 text-[#c49a6c]">
                                    @for($s = 1; $s <= 5; $s++)
                                        <svg class="w-4 h-4 {{ $s <= $review->rating ? 'fill-current text-[#c49a6c]' : 'fill-current text-gray-700' }}" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                        </svg>
                                    @endfor
                                </div>
                            </div>

                            <p class="text-gray-300 text-sm leading-relaxed mt-2 whitespace-pre-line">
                                "{{ $review->comment }}"
                            </p>
                        </div>
                    @endforeach
                </div>

                <!-- Pagination Links -->
                <div class="pt-4">
                    {{ $reviews->links() }}
                </div>
            @endif
        </div>

    </div>
</section>

<!-- Lightweight Interactive Star Rating & AJAX Script -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const starBtns = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('rating-input');
    const ratingText = document.getElementById('rating-text');
    const form = document.getElementById('review-form');
    const submitBtn = document.getElementById('submit-review-btn');
    const btnText = document.getElementById('review-btn-text');
    const btnSpinner = document.getElementById('review-btn-spinner');
    const successAlert = document.getElementById('ajax-success-alert');
    const successMsg = document.getElementById('ajax-success-msg');
    const errorAlert = document.getElementById('review-error-alert');
    const errorMsg = document.getElementById('review-error-msg');

    const ratingLabels = {
        1: '1 Bintang (Buruk)',
        2: '2 Bintang (Cukup)',
        3: '3 Bintang (Biasa)',
        4: '4 Bintang (Bagus)',
        5: '5 Bintang (Sangat Memuaskan)'
    };

    let currentRating = 5;

    function updateStars(rating) {
        starBtns.forEach(btn => {
            const r = parseInt(btn.getAttribute('data-rating'));
            if (r <= rating) {
                btn.classList.remove('text-gray-600');
                btn.classList.add('text-[#c49a6c]');
            } else {
                btn.classList.remove('text-[#c49a6c]');
                btn.classList.add('text-gray-600');
            }
        });
        ratingText.textContent = ratingLabels[rating] || `${rating} Bintang`;
    }

    starBtns.forEach(btn => {
        btn.addEventListener('mouseover', function () {
            const r = parseInt(this.getAttribute('data-rating'));
            updateStars(r);
        });

        btn.addEventListener('mouseleave', function () {
            updateStars(currentRating);
        });

        btn.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = currentRating;
            updateStars(currentRating);
        });
    });

    // Initialize with 5 stars
    updateStars(currentRating);

    // AJAX Form Handler
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            errorAlert.classList.add('hidden');
            successAlert.classList.add('hidden');

            const formData = new FormData(form);

            submitBtn.disabled = true;
            btnText.textContent = 'Mengirim...';
            btnSpinner.classList.remove('hidden');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]')?.value || '',
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    const msg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Gagal mengirim ulasan.');
                    errorMsg.textContent = msg;
                    errorAlert.classList.remove('hidden');
                    return;
                }

                // Show success message
                successMsg.textContent = data.message || 'Ulasan kamu sedang ditinjau sebelum tampil.';
                successAlert.classList.remove('hidden');
                form.reset();
                currentRating = 5;
                ratingInput.value = 5;
                updateStars(5);

            } catch (err) {
                errorMsg.textContent = 'Terjadi kesalahan koneksi server. Silakan coba lagi.';
                errorAlert.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = 'Kirim Ulasan';
                btnSpinner.classList.add('hidden');
            }
        });
    }
});
</script>
