<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Transport\Smtp\Stream\SocketStream;

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
                // Create a custom stream with SSL verification disabled
                $stream = new SocketStream();
                $stream->setHost($config['host']);
                $stream->setPort($config['port']);
                $stream->setTimeout($config['timeout'] ?? 30);
                
                // Set SSL context options to disable certificate verification
                $stream->setStreamOptions([
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                    ],
                ]);

                // Create transport with the custom stream
                $transport = new EsmtpTransport(
                    $config['host'],
                    $config['port'],
                    $config['encryption'] === 'tls',
                    null, // dispatcher
                    null, // logger
                    $config['timeout'] ?? null,
                    $config['local_domain'] ?? null,
                    $stream
                );

                $transport->setUsername($config['username']);
                $transport->setPassword($config['password']);

                return $transport;
            });
        });
    }
}
