<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Cancelled - {{ $clinic->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; color: #374151; }
        .detail-value { color: #6b7280; }
        .cancellation-reason { background: #fef2f2; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #fecaca; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .status-badge { background: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚫 Appointment Cancelled</h1>
            <p>{{ $clinic->name }}</p>
        </div>

        <div class="content">
            <h2>Patient Cancelled Appointment</h2>
            <p>A patient has cancelled their appointment. Please review the details below:</p>

            <div class="appointment-details">
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge">CANCELLED</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Name:</span>
                    <span class="detail-value">{{ $patient->first_name }} {{ $patient->last_name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Email:</span>
                    <span class="detail-value">{{ $patient->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Patient Phone:</span>
                    <span class="detail-value">{{ $patient->phone_number ?? 'Not provided' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Original Date & Time:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reason for Visit:</span>
                    <span class="detail-value">{{ $appointment->reason ?? 'Not specified' }}</span>
                </div>
                @if($appointment->assignedDentist)
                <div class="detail-row">
                    <span class="detail-label">Assigned Dentist:</span>
                    <span class="detail-value">{{ $appointment->assignedDentist->name }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Cancelled At:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($appointment->cancelled_at)->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
            </div>

            @if($appointment->cancellation_reason)
            <div class="cancellation-reason">
                <h3>📝 Cancellation Reason:</h3>
                <p><em>"{{ $appointment->cancellation_reason }}"</em></p>
            </div>
            @endif

            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Action Required</h3>
                <p style="margin: 0; color: #92400e;">This appointment slot is now available. You may want to:</p>
                <ul style="margin: 10px 0 0 0; color: #92400e;">
                    <li>Contact other patients on the waitlist</li>
                    <li>Update your schedule</li>
                    <li>Notify the assigned dentist</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated notification from Smile Suite.</p>
            <p>Please log into your clinic dashboard to manage appointments.</p>
        </div>
    </div>
</body>
</html>
