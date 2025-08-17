<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\User;

class ReviewSeeder extends Seeder
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

        // Create a sample patient user if it doesn't exist
        $patientUser = User::firstOrCreate(
            ['email' => 'patient@example.com'],
            [
                'name' => 'John Doe',
                'password' => bcrypt('password'),
                'role' => 'patient',
                'clinic_id' => $clinic->id,
            ]
        );

        // Create a patient record
        $patient = Patient::firstOrCreate(
            [
                'user_id' => $patientUser->id,
                'clinic_id' => $clinic->id,
            ],
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'patient@example.com',
                'phone_number' => '09123456789',
                'date_of_birth' => '1990-01-01',
                'gender' => 'male',
            ]
        );

        // Sample reviews
        $reviews = [
            [
                'title' => 'Excellent Dental Care',
                'content' => 'I had a wonderful experience at this clinic. The staff was very professional and the dentist was gentle and thorough. Highly recommend!',
                'rating' => 5,
                'source' => 'internal',
                'status' => 'approved',
                'review_date' => now()->subDays(2),
            ],
            [
                'title' => 'Great Service',
                'content' => 'The clinic is clean and modern. The dentist explained everything clearly and made me feel comfortable throughout the procedure.',
                'rating' => 4,
                'source' => 'internal',
                'status' => 'approved',
                'review_date' => now()->subDays(5),
            ],
            [
                'title' => 'Professional and Caring',
                'content' => 'I was nervous about my dental procedure, but the team here made me feel at ease. The results were excellent and I would definitely return.',
                'rating' => 5,
                'source' => 'internal',
                'status' => 'approved',
                'review_date' => now()->subDays(10),
            ],
            [
                'title' => 'Good Experience',
                'content' => 'The clinic is well-organized and the staff is friendly. The waiting time was reasonable and the treatment was effective.',
                'rating' => 4,
                'source' => 'internal',
                'status' => 'approved',
                'review_date' => now()->subDays(15),
            ],
            [
                'title' => 'Highly Recommended',
                'content' => 'I found this clinic through a friend\'s recommendation and I\'m glad I did. The quality of care is outstanding and the prices are reasonable.',
                'rating' => 5,
                'source' => 'internal',
                'status' => 'approved',
                'review_date' => now()->subDays(20),
            ],
        ];

        foreach ($reviews as $reviewData) {
            Review::firstOrCreate(
                [
                    'clinic_id' => $clinic->id,
                    'patient_id' => $patient->id,
                    'content' => $reviewData['content'],
                ],
                array_merge($reviewData, [
                    'clinic_id' => $clinic->id,
                    'patient_id' => $patient->id,
                ])
            );
        }

        $this->command->info('Sample reviews created successfully!');
    }
}
