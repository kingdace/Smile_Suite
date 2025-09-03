<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Confirmed - {{ $appointment->clinic->name }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .title {
            color: #059669;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .appointment-details {
            background-color: #f0fdf4;
            border: 2px solid #bbf7d0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #d1fae5;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
        }
        .detail-value {
            color: #1f2937;
        }
        .contact-info {
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .important-notes {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/smile-suite-logo.png') }}" alt="Smile Suite" class="logo">
            <div class="title">Appointment Confirmed! 🦷✅</div>
            <div class="subtitle">{{ $appointment->clinic->name }}</div>
        </div>

        <div class="content">
            <p>Dear {{ $patient->first_name }},</p>

            <p>Great news! Your appointment request at <strong>{{ $appointment->clinic->name }}</strong> has been approved and confirmed.</p>

            <div class="appointment-details">
                <h3 style="margin-top: 0; color: #059669;">📅 Your Confirmed Appointment</h3>
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('F j, Y \a\t g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dentist:</span>
                    <span class="detail-value">
                        @if($dentist)
                            Dr. {{ $dentist->name }}
                        @else
                            Will be assigned closer to your appointment date
                        @endif
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">{{ $appointment->reason }}</span>
                </div>
                @if($appointment->service)
                <div class="detail-row">
                    <span class="detail-label">Service Details:</span>
                    <span class="detail-value">{{ $appointment->service->name }}</span>
                </div>
                @endif
                @if($appointment->notes)
                <div class="detail-row">
                    <span class="detail-label">Your Notes:</span>
                    <span class="detail-value">{{ $appointment->notes }}</span>
                </div>
                @endif
            </div>

            <div class="contact-info">
                <h4 style="margin-top: 0; color: #1e40af;">📞 Contact Information</h4>
                <p><strong>Phone:</strong> {{ $appointment->clinic->contact_number }}<br>
                <strong>Email:</strong> {{ $appointment->clinic->email }}<br>
                <strong>Address:</strong> {{ $appointment->clinic->street_address }}, {{ $appointment->clinic->address_details }}</p>
            </div>

            <div class="important-notes">
                <h4 style="margin-top: 0;">⚠️ Important Reminders</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please arrive <strong>10 minutes early</strong> for your appointment</li>
                    <li>Bring a valid ID and any relevant medical records</li>
                    <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                    <li>Payment will be handled at the clinic</li>
                </ul>
            </div>

            <p><strong>Need to Make Changes?</strong><br>
            If you need to reschedule or have any questions, please contact us as soon as possible.</p>

            <p>We look forward to providing you with excellent dental care!</p>

            <p>Best regards,<br>
            <strong>{{ $appointment->clinic->name }} Team</strong></p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
            <p><em>This is a confirmed appointment. Please keep this email for your records.</em></p>
        </div>
    </div>
</body>
</html>
