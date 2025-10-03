<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;

class SmtpSslFixServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Override the SMTP mailer to fix SSL certificate issues
        $this->app->afterResolving(MailManager::class, function (MailManager $mailManager) {
            $mailManager->extend('smtp', function (array $config) {
                // Create transport with SSL verification disabled
                $transport = new EsmtpTransport(
                    $config['host'],
                    $config['port'],
                    $config['encryption'] === 'tls',
                    null,
                    null,
                    $config['timeout'] ?? null,
                    $config['local_domain'] ?? null,
                    [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                    ]
                );

                $transport->setUsername($config['username']);
                $transport->setPassword($config['password']);

                return $transport;
            });
        });
    }
}
