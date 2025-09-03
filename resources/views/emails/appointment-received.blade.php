<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Request Received - {{ $clinic->name }}</title>
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
            color: #1e40af;
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
            background-color: #f3f4f6;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
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
        .next-steps {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
        }
        .contact-info {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
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
            <div class="title">Appointment Request Received! 🦷</div>
            <div class="subtitle">{{ $clinic->name }}</div>
        </div>

        <div class="content">
            <p>Dear {{ $patient->first_name }},</p>

            <p>Thank you for choosing <strong>{{ $clinic->name }}</strong> for your dental care needs. We have received your appointment request and will review it shortly.</p>

            <div class="appointment-details">
                <h3 style="margin-top: 0; color: #1e40af;">📅 Your Appointment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Clinic:</span>
                    <span class="detail-value">{{ $clinic->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Requested Date:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('F j, Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Requested Time:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value">{{ $appointment->reason }}</span>
                </div>
                @if($appointment->service)
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">{{ $appointment->service->name }}</span>
                </div>
                @endif
                @if($appointment->notes)
                <div class="detail-row">
                    <span class="detail-label">Additional Notes:</span>
                    <span class="detail-value">{{ $appointment->notes }}</span>
                </div>
                @endif
            </div>

            <div class="next-steps">
                <h4 style="margin-top: 0; color: #1e40af;">⏳ What Happens Next?</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Review Process</strong> - Our team will review your request and check availability</li>
                    <li><strong>Confirmation</strong> - You'll receive a confirmation email with the exact appointment details</li>
                    <li><strong>Dentist Assignment</strong> - We'll assign the most suitable dentist for your needs</li>
                    <li><strong>Final Details</strong> - Any specific instructions or preparation requirements will be provided</li>
                </ol>
            </div>

            <div class="contact-info">
                <h4 style="margin-top: 0; color: #059669;">📞 Contact Information</h4>
                <p>If you have any questions or need to make changes, please contact us:</p>
                <p><strong>Phone:</strong> {{ $clinic->contact_number }}<br>
                <strong>Email:</strong> {{ $clinic->email }}<br>
                <strong>Address:</strong> {{ $clinic->street_address }}, {{ $clinic->address_details }}</p>
            </div>

            <div class="important-notes">
                <h4 style="margin-top: 0;">⚠️ Important Notes</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This is a <strong>request</strong> that requires clinic approval</li>
                    <li>The final appointment time may be adjusted based on availability</li>
                    <li>Please arrive 10 minutes before your scheduled time</li>
                    <li>Bring a valid ID and any relevant medical records</li>
                </ul>
            </div>

            <p>We look forward to providing you with excellent dental care!</p>

            <p>Best regards,<br>
            <strong>{{ $clinic->name }} Team</strong></p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
            <p><em>This is an automated message. Please do not reply to this email.</em></p>
        </div>
    </div>
</body>
</html>
