<!-- Tailwind CSS Dark & Gold Elegant Nail Analysis Blade Partial -->
<div class="w-full max-w-4xl mx-auto my-8 font-sans antialiased text-gray-100">
    
    <!-- Upload Form Card -->
    <div id="upload-card" class="bg-[#1a1a1a] border border-[#c49a6c]/30 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300">
        
        <!-- Header -->
        <div class="text-center mb-8">
            <span class="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-[#c49a6c] bg-[#c49a6c]/10 border border-[#c49a6c]/30 rounded-full uppercase mb-3">
                AI Powered Feature
            </span>
            <h2 class="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                Analisis Kuku & Rekomendasi AI
            </h2>
            <p class="text-gray-400 text-sm md:text-base mt-2">
                Unggah foto kuku Anda untuk mendapatkan analisis bentuk, warna, serta rekomendasi desain kuku yang paling cocok.
            </p>
        </div>

        <!-- Form -->
        <form id="nail-analysis-form" class="space-y-6" enctype="multipart/form-data">
            @csrf

            <!-- Error Alert -->
            <div id="error-alert" class="hidden p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm leading-relaxed">
                <span id="error-message"></span>
            </div>

            <!-- Upload Dropzone -->
            <div class="relative">
                <label for="nail-image-input" class="group flex flex-col items-center justify-center w-full min-h-[220px] border-2 border-dashed border-[#c49a6c]/40 hover:border-[#c49a6c] bg-[#121212]/60 hover:bg-[#121212] rounded-2xl cursor-pointer transition-all duration-300 p-6 text-center">
                    
                    <!-- Placeholder Icon & Text -->
                    <div id="upload-placeholder" class="flex flex-col items-center space-y-3">
                        <div class="w-14 h-14 rounded-full bg-[#c49a6c]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg class="w-7 h-7 text-[#c49a6c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-200">
                                <span class="text-[#c49a6c] font-semibold underline underline-offset-4">Klik untuk unggah</span> atau tarik foto ke sini
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG, WEBP (Maksimal 5MB)</p>
                        </div>
                    </div>

                    <!-- Image Preview -->
                    <div id="preview-container" class="hidden flex-col items-center space-y-3 w-full">
                        <img id="image-preview" src="#" alt="Preview Kuku" class="max-h-48 rounded-xl object-contain border border-[#c49a6c]/40 shadow-md">
                        <p class="text-xs text-[#c49a6c] font-medium">Klik untuk mengganti foto</p>
                    </div>

                    <input type="file" id="nail-image-input" name="image" accept="image/jpeg,image/png,image/webp" class="hidden">
                </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="submit-btn" class="w-full py-4 px-6 rounded-xl font-semibold text-charcoal bg-gradient-to-r from-[#c49a6c] via-[#d4b996] to-[#c49a6c] hover:from-[#b08556] hover:to-[#b08556] transition-all duration-300 shadow-lg hover:shadow-[#c49a6c]/20 flex items-center justify-center space-x-2 text-base tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                <span id="btn-text">Analisis Kuku Saya</span>
                <svg id="btn-spinner" class="hidden animate-spin h-5 w-5 text-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </button>
        </form>
    </div>

    <!-- Analysis Result Section -->
    <div id="result-section" class="hidden mt-8 bg-[#1a1a1a] border border-[#c49a6c]/40 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 transition-all duration-500">
        
        <!-- Result Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-[#c49a6c]/20 pb-4 gap-4">
            <div>
                <h3 class="text-xl font-serif font-bold text-white tracking-wide">Hasil Analisis AI</h3>
                <p class="text-xs text-gray-400">Analisis presisi bentuk & kecocokan desain kuku Anda</p>
            </div>
            
            <!-- AI Match Percentage Badge -->
            <div class="flex items-center space-x-2 bg-[#c49a6c]/10 border border-[#c49a6c]/40 px-4 py-2 rounded-full w-fit">
                <span class="text-xs text-gray-300">Tingkat Kecocokan:</span>
                <span id="res-match-percentage" class="text-lg font-bold text-[#c49a6c]">-</span>
            </div>
        </div>

        <!-- 4 Grid Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Card 1: Bentuk Nail Bed -->
            <div class="bg-[#121212] p-4 rounded-xl border border-gray-800">
                <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Bentuk Nail Bed</p>
                <p id="res-nail-bed-shape" class="text-lg font-bold text-white mt-1 capitalize">-</p>
            </div>

            <!-- Card 2: Warna Dasar Kuku -->
            <div class="bg-[#121212] p-4 rounded-xl border border-gray-800">
                <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Warna Dasar Kuku</p>
                <p id="res-nail-color" class="text-lg font-bold text-white mt-1 capitalize">-</p>
            </div>

            <!-- Card 3: Warna Kulit -->
            <div class="bg-[#121212] p-4 rounded-xl border border-gray-800">
                <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Warna Kulit</p>
                <p id="res-skin-tone" class="text-lg font-bold text-white mt-1 capitalize">-</p>
            </div>

            <!-- Card 4: Tipe Rekomendasi -->
            <div class="bg-[#121212] p-4 rounded-xl border border-gray-800">
                <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tipe Rekomendasi</p>
                <span id="res-recommendation-type" class="inline-block mt-1 px-3 py-0.5 text-xs font-bold text-[#c49a6c] bg-[#c49a6c]/20 rounded-full border border-[#c49a6c]/40">
                    -
                </span>
            </div>
        </div>

        <!-- Rekomendasi Desain -->
        <div class="bg-[#121212] p-5 rounded-xl border border-[#c49a6c]/30 space-y-2">
            <h4 class="text-sm font-semibold text-[#c49a6c] uppercase tracking-wider flex items-center space-x-2">
                <svg class="w-4 h-4 text-[#c49a6c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                <span>Rekomendasi Desain</span>
            </h4>
            <p id="res-design-recommendation" class="text-gray-300 text-sm leading-relaxed">
                -
            </p>
        </div>

        <!-- Reset Button -->
        <div class="pt-2 text-right">
            <button type="button" id="reset-btn" class="px-5 py-2.5 text-xs font-semibold text-[#c49a6c] hover:text-white border border-[#c49a6c]/40 hover:bg-[#c49a6c]/20 rounded-xl transition-all duration-300">
                Analisis Foto Lain
            </button>
        </div>
    </div>
</div>

<!-- AJAX Fetch Script -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('nail-analysis-form');
    const input = document.getElementById('nail-image-input');
    const placeholder = document.getElementById('upload-placeholder');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('image-preview');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    const resetBtn = document.getElementById('reset-btn');

    // Live Image Preview
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                placeholder.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                previewContainer.classList.add('flex');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Submit via Fetch AJAX
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Hide previous errors
        errorAlert.classList.add('hidden');
        errorMessage.textContent = '';

        if (!input.files || !input.files[0]) {
            showError('Silakan pilih foto kuku terlebih dahulu.');
            return;
        }

        // Prepare FormData
        const formData = new FormData(form);

        // Show loading state
        setLoading(true);

        try {
            const response = await fetch("{{ route('nail-analysis.analyze') }}", {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]')?.value || '',
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                const msg = result.message || (result.errors ? Object.values(result.errors).flat().join(' ') : 'Gagal memproses analisis.');
                showError(msg);
                return;
            }

            // Populate Results
            const data = result.data;
            document.getElementById('res-nail-bed-shape').textContent = data.nail_bed_shape || 'N/A';
            document.getElementById('res-nail-color').textContent = data.nail_color || 'N/A';
            document.getElementById('res-skin-tone').textContent = data.skin_tone || 'N/A';
            document.getElementById('res-recommendation-type').textContent = data.recommendation_type || 'N/A';
            document.getElementById('res-design-recommendation').textContent = data.design_recommendation || 'Tidak ada rekomendasi spesifik.';
            document.getElementById('res-match-percentage').textContent = data.ai_match_percentage ? `${data.ai_match_percentage}%` : 'N/A';

            // Show result section smoothly
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });

        } catch (err) {
            showError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    });

    // Reset Form
    resetBtn.addEventListener('click', function () {
        form.reset();
        previewImage.src = '#';
        previewContainer.classList.add('hidden');
        previewContainer.classList.remove('flex');
        placeholder.classList.remove('hidden');
        resultSection.classList.add('hidden');
        errorAlert.classList.add('hidden');
        window.scrollTo({ top: form.offsetTop - 50, behavior: 'smooth' });
    });

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = 'Sedang Menganalisis Kuku...';
            btnSpinner.classList.remove('hidden');
        } else {
            btnText.textContent = 'Analisis Kuku Saya';
            btnSpinner.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.classList.remove('hidden');
    }
});
</script>
