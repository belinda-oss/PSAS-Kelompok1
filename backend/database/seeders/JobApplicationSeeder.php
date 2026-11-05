<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    /**
     * Seed contoh lamaran kerja untuk dashboard admin.
     */
    public function run(): void
    {
        $applications = [
            [
                'full_name' => 'Amanda Putri',
                'email' => 'amanda.putri@example.com',
                'phone' => '+62 812-3456-7890',
                'position' => 'Senior Eyelash Artist',
                'experience' => '3-5 Tahun',
                'portfolio_url' => 'https://linkedin.com/in/amandaputri',
                'cover_letter' => 'Saya memiliki pengalaman 4 tahun sebagai eyelash artist dan ingin berkembang bersama Shofi Eyelash.',
                'is_reviewed' => false,
            ],
            [
                'full_name' => 'Rina Kartika',
                'email' => 'rina.kartika@example.com',
                'phone' => '+62 813-2233-4455',
                'position' => 'Digital Marketing & Social Media',
                'experience' => '1-3 Tahun',
                'portfolio_url' => 'https://drive.google.com/file/d/contoh-cv',
                'cover_letter' => 'Saya tertarik membangun konten kecantikan yang kreatif untuk brand Shofi Eyelash.',
                'is_reviewed' => true,
            ],
            [
                'full_name' => 'Dewi Rahayu',
                'email' => 'dewi.rahayu@example.com',
                'phone' => '+62 811-9988-7766',
                'position' => 'Nail Art Specialist',
                'experience' => '1-3 Tahun',
                'portfolio_url' => null,
                'cover_letter' => 'Saya suka membuat desain nail art dan ingin bergabung dengan tim yang suportif.',
                'is_reviewed' => true,
            ],
        ];

        foreach ($applications as $application) {
            JobApplication::create($application);
        }
    }
}
