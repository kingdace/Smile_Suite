<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the email system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'kite.gales10@gmail.com';

        $this->info('Testing email system...');
        $this->info('Sending test email to: ' . $email);

        try {
            Mail::raw('Test email from Smile Suite - ' . now(), function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - Smile Suite');
            });

            $this->info('✅ Test email sent successfully!');
            $this->info('Check your inbox (and spam folder) for the test email.');

        } catch (\Exception $e) {
            $this->error('❌ Email test failed: ' . $e->getMessage());
            $this->error('This might be due to:');
            $this->error('- Gmail security settings');
            $this->error('- Email configuration issues');
            $this->error('- Network connectivity problems');
        }
    }
}
