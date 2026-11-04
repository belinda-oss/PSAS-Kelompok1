<?php

namespace Database\Seeders;

use App\Models\NailArtExample;
use Illuminate\Database\Seeder;

class NailArtExampleSeeder extends Seeder
{
    /**
     * Seed contoh nail art bawaan untuk engine generator (YOLOv8 + MediaPipe).
     *
     * Contoh di-seed tanpa gambar agar admin dapat mengunggah foto aslinya
     * lewat dashboard. Aman dijalankan berulang karena memakai updateOrCreate.
     */
    public function run(): void
    {
        $examples = [
            [
                'slug' => 'contoh_blush_jelly',
                'name' => 'Contoh Korean Blush Jelly',
                'category' => 'Trending Korean',
                'design_id' => 'blush_jelly',
                'description' => 'Contoh hasil gradasi jelly pink transparan dengan glitter halus.',
                'sort_order' => 1,
            ],
            [
                'slug' => 'contoh_french_gold',
                'name' => 'Contoh French Glam Gold',
                'category' => 'Elegant Luxury',
                'design_id' => 'french_gold',
                'description' => 'Contoh French tip putih dengan aksen foil emas metalik.',
                'sort_order' => 2,
            ],
            [
                'slug' => 'contoh_aurora_glaze',
                'name' => 'Contoh Pastel Aurora Glaze',
                'category' => 'Mermaid / Glaze',
                'design_id' => 'aurora_glaze',
                'description' => 'Contoh kilau aurora lilac dan mint pearlescent.',
                'sort_order' => 3,
            ],
            [
                'slug' => 'contoh_sakura_floral',
                'name' => 'Contoh Cherry Blossom Floral',
                'category' => 'Cute & Kawaii',
                'design_id' => 'sakura_floral',
                'description' => 'Contoh motif kelopak sakura dengan aksen putik emas.',
                'sort_order' => 4,
            ],
            [
                'slug' => 'contoh_starry_night',
                'name' => 'Contoh Celestial Starry Night',
                'category' => 'Mystic Galaxy',
                'design_id' => 'starry_night',
                'description' => 'Contoh nuansa biru malam dengan rasi bintang perak.',
                'sort_order' => 5,
            ],
            [
                'slug' => 'contoh_ruby_velvet',
                'name' => 'Contoh Ruby Velvet Glamour',
                'category' => 'Bold Luxury',
                'design_id' => 'ruby_velvet',
                'description' => 'Contoh warna marun velvet dengan garis cat-eye 3D.',
                'sort_order' => 6,
            ],
            [
                'slug' => 'contoh_cute_doodle',
                'name' => 'Contoh Pastel Y2K Mini Doodle',
                'category' => 'Cute & Kawaii',
                'design_id' => 'cute_doodle',
                'description' => 'Contoh doodle pastel lucu di atas dasar butter cream.',
                'sort_order' => 7,
            ],
            [
                'slug' => 'contoh_rose_foil',
                'name' => 'Contoh Minimalist Rose Gold Foil',
                'category' => 'Chic Minimalist',
                'design_id' => 'rose_foil',
                'description' => 'Contoh nude susu dengan serpihan rose gold foil.',
                'sort_order' => 8,
            ],
        ];

        foreach ($examples as $example) {
            NailArtExample::updateOrCreate(
                ['slug' => $example['slug']],
                $example + [
                    'engine' => 'YOLOv8 + MediaPipe',
                    'is_active' => true,
                ]
            );
        }
    }
}
