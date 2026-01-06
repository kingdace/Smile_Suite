<?php

/**
 * This file fixes Gmail SMTP SSL certificate verification issues
 * Add this to config/mail.php or use it to override mail settings
 */

return [
    'gmail_fixed' => [
        'transport' => 'smtp',
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'encryption' => 'tls',
        'username' => env('MAIL_USERNAME'),
        'password' => env('MAIL_PASSWORD'),
        'timeout' => 60,
        'stream' => [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ],
    ],
];
