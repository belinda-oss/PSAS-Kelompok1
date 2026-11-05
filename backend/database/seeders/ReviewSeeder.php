<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Seed ulasan pelanggan bawaan yang sudah disetujui admin.
     * Aman dijalankan berulang karena memakai firstOrCreate.
     */
    public function run(): void
    {
        $reviews = [
            ['Sarah Wijaya', 5, 'Hasilnya sangat natural dan tahan lama. Teknisi sangat profesional dan ramah!', 2],
            ['Amanda Putri', 5, 'Tempatnya sangat nyaman dan bersih. Sangat merekomendasikan Shofi Eyelash!', 7],
            ['Rina Kartika', 5, 'Volume set-nya juara! Mata jadi terlihat lebih hidup tapi tetap ringan.', 14],
            ['Dewi Rahayu', 4, 'Nail art-nya rapi dan detail, hasilnya melebihi ekspektasi saya.', 21],
            ['Siti Nurhaliza', 5, 'Eyebrow embroidery-nya sangat natural, tidak keliatan seperti sulam alis biasa!', 30],
            ['Farah Diba', 5, 'Foot spa-nya sangat relaxing. Kaki jadi halus dan segar. Wajib balik lagi!', 32],
        ];

        foreach ($reviews as [$name, $rating, $comment, $daysAgo]) {
            $createdAt = now()->subDays($daysAgo);

            Review::firstOrCreate(
                [
                    'name' => $name,
                    'comment' => $comment,
                ],
                [
                    'rating' => $rating,
                    'status' => 'published',
                    'created_at' => $createdAt,
                    'published_at' => $createdAt,
                ]
            );
        }
    }
}
