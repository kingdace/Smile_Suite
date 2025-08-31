<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\ClinicGalleryImage;

class ClinicGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first clinic
        $clinic = Clinic::first();

        if (!$clinic) {
            $this->command->info('No clinic found. Please create a clinic first.');
            return;
        }

        // Sample gallery images (using placeholder URLs for now)
        $sampleImages = [
            [
                'image_url' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1588776814546-1ffcf6fs199?w=800&h=600&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($sampleImages as $imageData) {
            ClinicGalleryImage::firstOrCreate(
                [
                    'clinic_id' => $clinic->id,
                    'image_url' => $imageData['image_url'],
                ],
                array_merge($imageData, [
                    'clinic_id' => $clinic->id,
                ])
            );
        }

        $this->command->info('Sample clinic gallery images created successfully!');
    }
}
