<?php

namespace Database\Seeders;

use Illuminate\Console\Command;

class ClinicSeeder2025Command extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:clinics-2025';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed 20 new Surigao dental clinics with 2-month active subscriptions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🏥 Starting ClinicSeeder2025...');
        
        $seeder = new ClinicSeeder2025();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('🎉 Clinic seeding completed successfully!');
        $this->info('💡 You can now view these clinics on the Find Clinics page');
        $this->info('🔑 Login credentials: admin@[clinicname].com / password123');
        
        return 0;
    }
}
