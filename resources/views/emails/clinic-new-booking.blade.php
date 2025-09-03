<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Online Appointment Request - {{ $clinic->name }}</title>
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
            color: #dc2626;
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
        .patient-info {
            background-color: #f3f4f6;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .appointment-details {
            background-color: #fef3c7;
            border: 2px solid #f59e0b;
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
        .action-required {
            background-color: #fef2f2;
            border: 2px solid #dc2626;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #dc2626;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 10px 0;
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
            <div class="title">New Online Appointment Request 📋</div>
            <div class="subtitle">{{ $clinic->name }}</div>
        </div>

        <div class="content">
            <p>A new appointment request has been submitted through your clinic's online booking system.</p>

            <div class="patient-info">
                <h3 style="margin-top: 0; color: #1e40af;">👤 Patient Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">{{ $patient->first_name }} {{ $patient->last_name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $patient->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ $patient->phone_number ?? 'Not provided' }}</span>
                </div>
            </div>

            <div class="appointment-details">
                <h3 style="margin-top: 0; color: #92400e;">📅 Appointment Request Details</h3>
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
                    <span class="detail-label">Service Requested:</span>
                    <span class="detail-value">{{ $appointment->service->name }}</span>
                </div>
                @endif
                @if($appointment->notes)
                <div class="detail-row">
                    <span class="detail-label">Patient Notes:</span>
                    <span class="detail-value">{{ $appointment->notes }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Request ID:</span>
                    <span class="detail-value">#{{ $appointment->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->created_at)->format('F j, Y \a\t g:i A') }}</span>
                </div>
            </div>

            <div class="action-required">
                <h3 style="margin-top: 0; color: #dc2626;">⚡ Action Required</h3>
                <p>Please review this appointment request and take one of the following actions:</p>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Approve</strong> - Confirm the appointment and assign a dentist</li>
                    <li><strong>Modify</strong> - Adjust the time/date and confirm</li>
                    <li><strong>Deny</strong> - Reject the request with a reason</li>
                </ol>
                <a href="http://localhost:8000/clinic/{{ $clinic->id }}/appointments/{{ $appointment->id }}/edit" class="button">
                    Review Appointment in Admin Panel
                </a>
            </div>

            <div class="important-notes">
                <h4 style="margin-top: 0;">⚠️ Important Notes</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This is an <strong>online booking request</strong> that requires your approval</li>
                    <li>The patient is expecting a confirmation email</li>
                    <li>Please respond within 24 hours for best patient experience</li>
                    <li>Consider dentist availability and service requirements</li>
                </ul>
            </div>

            <p><strong>Clinic:</strong> {{ $clinic->name }}<br>
            <strong>Request Time:</strong> {{ \Carbon\Carbon::now()->format('F j, Y \a\t g:i A') }}</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
            <p><em>This is an automated notification from your Smile Suite clinic management system.</em></p>
        </div>
    </div>
</body>
</html>
