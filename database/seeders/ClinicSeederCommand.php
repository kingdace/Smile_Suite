<?php

namespace Database\Seeders;

use Illuminate\Console\Command;

class ClinicSeederCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:seed:clinics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with 12 professional Philippine clinics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Seeding 12 professional Philippine clinics...');

        $seeder = new ClinicSeeder();
        $seeder->run();

        $this->info('✅ Successfully seeded 12 clinics!');
        $this->info('Clinics are now available on the Find Clinics page.');
    }
}
