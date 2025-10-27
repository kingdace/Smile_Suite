<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class SemaphoreSmsService
{
    protected string $apiKey;
    protected string $senderName;
    protected bool $testMode;

    public function __construct()
    {
        $this->apiKey = config('services.semaphore.api_key');
        $this->senderName = config('services.semaphore.sender_name');
        $this->testMode = config('services.semaphore.test_mode', true);
    }

    /**
     * Send SMS via Semaphore API
     */
    public function send(string $phone, string $message): array
    {
        try {
            // Validate phone number
            if (!$this->validatePhoneNumber($phone)) {
                throw new Exception("Invalid phone number format: {$phone}");
            }

            // Format phone number
            $formattedPhone = $this->formatPhoneNumber($phone);

            // Handle test mode
            if ($this->testMode) {
                Log::info('SMS (TEST MODE) - Would send to ' . $formattedPhone, [
                    'message' => $message,
                    'sender' => $this->senderName
                ]);

                return [
                    'success' => true,
                    'test_mode' => true,
                    'message' => 'SMS not sent (test mode)',
                    'to' => $formattedPhone
                ];
            }

            // Send actual SMS
            // Try multiple SSL verification methods for Windows compatibility
            $caCertFile = base_path('cacert.pem');
            $verifySsl = file_exists($caCertFile) ? $caCertFile : false;

            try {
                $response = Http::withOptions([
                    'verify' => $verifySsl,
                    'timeout' => 30,
                ])
                ->withHeaders([
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ])
                ->asForm()
                ->post('https://api.semaphore.co/api/v4/messages', [
                    'apikey' => $this->apiKey,
                    'number' => $formattedPhone,
                    'message' => $message,
                    'sendername' => $this->senderName
                ]);
            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                // If SSL fails, disable SSL verification as fallback (not ideal but works)
                Log::warning('SSL verification failed, retrying without verification');
                $response = Http::withOptions([
                    'verify' => false,
                    'timeout' => 30,
                ])
                ->withHeaders([
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ])
                ->asForm()
                ->post('https://api.semaphore.co/api/v4/messages', [
                    'apikey' => $this->apiKey,
                    'number' => $formattedPhone,
                    'message' => $message,
                    'sendername' => $this->senderName
                ]);
            }

            $result = $response->json();

            if ($response->successful() && isset($result[0]['message_id'])) {
                Log::info('SMS sent successfully', [
                    'to' => $formattedPhone,
                    'message_id' => $result[0]['message_id'] ?? null
                ]);

                return [
                    'success' => true,
                    'test_mode' => false,
                    'message_id' => $result[0]['message_id'] ?? null,
                    'to' => $formattedPhone
                ];
            } else {
                Log::error('SMS failed to send', [
                    'to' => $formattedPhone,
                    'error' => $result
                ]);

                throw new Exception('Failed to send SMS: ' . json_encode($result));
            }

        } catch (Exception $e) {
            Log::error('SMS error', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'to' => $phone
            ];
        }
    }

    /**
     * Send SMS to multiple recipients
     */
    public function sendBulk(array $recipients): array
    {
        $results = [];

        foreach ($recipients as $recipient) {
            $results[] = $this->send(
                $recipient['phone'],
                $recipient['message']
            );
        }

        return $results;
    }

    /**
     * Send appointment confirmation SMS
     */
    public function sendAppointmentConfirmation($appointment, $patient, $dentist = null): array
    {
        $clinic = $appointment->clinic;
        $date = \Carbon\Carbon::parse($appointment->scheduled_at)->format('M j, Y \a\t g:i A');
        $dentistName = $dentist ? $dentist->name : 'assigned dentist';

        $message = "Hi {$patient->first_name}! Your appointment at {$clinic->name} is confirmed for {$date} with {$dentistName}. See you there! - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Send appointment reminder SMS
     */
    public function sendAppointmentReminder($appointment, $patient, $dentist = null): array
    {
        $clinic = $appointment->clinic;
        $time = \Carbon\Carbon::parse($appointment->scheduled_at)->format('g:i A');
        $dentistName = $dentist ? $dentist->name : 'your dentist';

        $message = "Hi {$patient->first_name}! Reminder: You have an appointment TODAY at {$time} with {$dentistName} at {$clinic->name}. See you soon! - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Send appointment denial SMS
     */
    public function sendAppointmentDenial($appointment, $patient, $reason = null): array
    {
        $clinic = $appointment->clinic;
        $date = \Carbon\Carbon::parse($appointment->scheduled_at)->format('M j, Y \a\t g:i A');

        $message = "Hi {$patient->first_name}! Your appointment at {$clinic->name} scheduled for {$date} has been cancelled. ";
        if ($reason) {
            $message .= "Reason: {$reason}. ";
        }
        $message .= "Please contact the clinic if you have questions. - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Send appointment cancellation SMS (patient-initiated)
     */
    public function sendAppointmentCancellation($appointment, $patient, $reason = null): array
    {
        $clinic = $appointment->clinic;
        $date = \Carbon\Carbon::parse($appointment->scheduled_at)->format('M j, Y \a\t g:i A');

        $message = "Hi {$patient->first_name}! Your appointment at {$clinic->name} for {$date} has been cancelled.";
        if ($reason) {
            $message .= " Reason: {$reason}. ";
        }
        $message .= "Thank you for using Smile Suite! - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Send reschedule denial SMS
     */
    public function sendRescheduleDenial($appointment, $patient, $reason = null): array
    {
        $clinic = $appointment->clinic;
        $date = \Carbon\Carbon::parse($appointment->scheduled_at)->format('M j, Y \a\t g:i A');

        $message = "Hi {$patient->first_name}! Your reschedule request for {$clinic->name} has been denied. Your appointment remains on {$date}. ";
        if ($reason) {
            $message .= "Reason: {$reason}. ";
        }
        $message .= "Please contact us if you need to reschedule. - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Send reschedule approval SMS
     */
    public function sendRescheduleApproval($appointment, $patient, $dentist = null): array
    {
        $clinic = $appointment->clinic;
        $date = \Carbon\Carbon::parse($appointment->scheduled_at)->format('M j, Y \a\t g:i A');
        $dentistName = $dentist ? $dentist->name : 'assigned dentist';

        $message = "Hi {$patient->first_name}! Your reschedule request at {$clinic->name} has been approved. Your new appointment is on {$date} with {$dentistName}. See you there! - Smile Suite";

        return $this->send($patient->phone_number, $message);
    }

    /**
     * Validate Philippine phone number
     */
    public function validatePhoneNumber(string $phone): bool
    {
        // Remove all non-digit characters except +
        $cleaned = preg_replace('/[^\d+]/', '', $phone);

        // Pattern for Philippine numbers
        // +639xxxxxxxxx or 639xxxxxxxxx or 09xxxxxxxxx
        $patterns = [
            '/^\+639\d{9}$/',     // +639123456789
            '/^639\d{9}$/',       // 639123456789
            '/^09\d{9}$/'         // 09123456789
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $cleaned)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Format phone number for Semaphore API
     */
    protected function formatPhoneNumber(string $phone): string
    {
        // Remove all non-digit characters
        $cleaned = preg_replace('/[^\d]/', '', $phone);

        // If starts with 0, replace with +639
        if (substr($cleaned, 0, 2) === '63') {
            return '+' . $cleaned;
        }

        if (substr($cleaned, 0, 2) === '09') {
            return '+63' . substr($cleaned, 1); // Replace 0 with +63
        }

        // If already starts with 9, add +63
        if (substr($cleaned, 0, 1) === '9') {
            return '+63' . $cleaned;
        }

        // Add + if not present
        if (!str_starts_with($cleaned, '+')) {
            $cleaned = '+' . $cleaned;
        }

        return $cleaned;
    }

    /**
     * Check if in test mode
     */
    public function isTestMode(): bool
    {
        return $this->testMode;
    }

    /**
     * Get SMS configuration for testing
     */
    public function getConfig(): array
    {
        return [
            'api_key' => substr($this->apiKey, 0, 8) . '...',
            'sender_name' => $this->senderName,
            'test_mode' => $this->testMode
        ];
    }
}

