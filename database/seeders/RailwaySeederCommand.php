<?php

namespace Database\Seeders;

use Illuminate\Console\Command;

class RailwaySeederCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'railway:seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run seeders specifically for Railway deployment (safe for manual MySQL dump)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Running Railway-specific seeders...');
        
        // Check if we already have enough clinics
        $clinicCount = \App\Models\Clinic::count();
        $this->info("📊 Current clinic count: $clinicCount");
        
        if ($clinicCount >= 30) {
            $this->info('✅ Database already has sufficient data. Skipping seeders.');
            return 0;
        }
        
        $this->info('🌱 Running database seeders...');
        
        try {
            // Run all seeders
            $this->call('db:seed', ['--force' => true]);
            
            $newClinicCount = \App\Models\Clinic::count();
            $this->info("✅ Seeders completed successfully!");
            $this->info("📊 New clinic count: $newClinicCount");
            
            if ($newClinicCount >= 30) {
                $this->info('🎉 All 20 Surigao clinics have been seeded!');
                $this->info('🔑 Login credentials: admin@[clinicname].com / password123');
            }
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error('❌ Seeder failed: ' . $e->getMessage());
            $this->error('💡 This might be due to duplicate data. Check your database.');
            return 1;
        }
    }
}
