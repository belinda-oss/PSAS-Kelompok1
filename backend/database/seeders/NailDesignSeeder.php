<?php

namespace Database\Seeders;

use App\Models\NailDesign;
use Illuminate\Database\Seeder;

class NailDesignSeeder extends Seeder
{
    /**
     * Seed katalog desain kuku bawaan.
     *
     * Motif tanpa `image_path` tetap dapat dipakai: AI Decorator Engine akan
     * memakai generator prosedural sebagai fallback sampai admin mengunggah gambar.
     * Aman dijalankan berulang karena memakai updateOrCreate berdasarkan slug.
     */
    public function run(): void
    {
        $designs = [
            [
                'slug' => 'blush_jelly',
                'name' => 'Korean Blush Jelly Ombre',
                'category' => 'Trending Korean',
                'tag' => 'Best Seller',
                'description' => 'Gradasi jelly transparan alami dengan rona merah muda di tengah dan butiran glitter bintang halus khas tren Seoul.',
                'swatch_color' => '#f472b6',
                'finish' => 'Ultra Glossy Jelly',
                'recommended_skin_tone' => 'Warm & Cool Fair',
                'sort_order' => 1,
            ],
            [
                'slug' => 'french_gold',
                'name' => 'French Glam Gold',
                'category' => 'Elegant Luxury',
                'tag' => 'Classy',
                'description' => 'Dasar nude pink klasik dipadukan dengan senyum French tip putih bersih beraksen garis foil emas metalik berkilau.',
                'swatch_color' => '#d4af37',
                'finish' => 'High Gloss Foil',
                'recommended_skin_tone' => 'Semua Tone Kulit',
                'sort_order' => 2,
            ],
            [
                'slug' => 'aurora_glaze',
                'name' => 'Pastel Aurora Glaze',
                'category' => 'Mermaid / Glaze',
                'tag' => 'Iridescent',
                'description' => 'Pantulan cahaya aurora pelangi lembut dengan nuansa lilac dan mint pearlescent yang memancarkan kilau multidimensi.',
                'swatch_color' => '#c084fc',
                'finish' => 'Holographic Glaze',
                'recommended_skin_tone' => 'Cool Rosé & Fair',
                'sort_order' => 3,
            ],
            [
                'slug' => 'sakura_floral',
                'name' => 'Cherry Blossom Floral',
                'category' => 'Cute & Kawaii',
                'tag' => 'Romantic',
                'description' => 'Motif kelopak bunga sakura musim semi mungil nan anggun dengan aksen putik emas di atas dasar milky pink.',
                'swatch_color' => '#fda4af',
                'finish' => 'Porcelain Gel',
                'recommended_skin_tone' => 'Warm Golden & Medium',
                'sort_order' => 4,
            ],
            [
                'slug' => 'starry_night',
                'name' => 'Celestial Starry Night',
                'category' => 'Mystic Galaxy',
                'tag' => 'Trending',
                'description' => 'Nuansa biru malam sapphire pekat dengan rasi bintang perak berkilauan dan sentuhan debu nebula kosmik.',
                'swatch_color' => '#3b82f6',
                'finish' => 'Cat-Eye Galaxy',
                'recommended_skin_tone' => 'Cool & Deep Olive',
                'sort_order' => 5,
            ],
            [
                'slug' => 'ruby_velvet',
                'name' => 'Ruby Velvet Glamour',
                'category' => 'Bold Luxury',
                'tag' => 'Sensual',
                'description' => 'Warna anggur merah marun velvet mewah dengan garis magnetik cat-eye 3D yang berpendar dinamis mengikuti cahaya.',
                'swatch_color' => '#991b1b',
                'finish' => 'Velvet Cat-Eye',
                'recommended_skin_tone' => 'Warm Medium & Deep',
                'sort_order' => 6,
            ],
            [
                'slug' => 'cute_doodle',
                'name' => 'Pastel Y2K Mini Doodle',
                'category' => 'Cute & Kawaii',
                'tag' => 'Playful',
                'description' => 'Koleksi doodle lucu mini hati pastel, pelangi mikro, dan senyum ceria di atas dasar warna butter cream cerah.',
                'swatch_color' => '#fde047',
                'finish' => 'Soft Gloss Gel',
                'recommended_skin_tone' => 'Semua Tone Kulit',
                'sort_order' => 7,
            ],
            [
                'slug' => 'rose_foil',
                'name' => 'Minimalist Rose Gold Foil',
                'category' => 'Chic Minimalist',
                'tag' => 'Subtle Glam',
                'description' => 'Kombinasi nude susu hangat dengan serpihan daun emas mawar (rose gold leaf) organik yang mewah dan estetik.',
                'swatch_color' => '#e0a96d',
                'finish' => 'High Gloss Glass',
                'recommended_skin_tone' => 'Warm Golden & Tan',
                'sort_order' => 8,
            ],
        ];

        foreach ($designs as $design) {
            NailDesign::updateOrCreate(
                ['slug' => $design['slug']],
                $design + ['is_active' => true]
            );
        }
    }
}
