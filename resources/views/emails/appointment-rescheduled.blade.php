<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment Rescheduled - {{ $clinic->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; color: #374151; }
        .detail-value { color: #6b7280; }
        .time-change { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #bfdbfe; }
        .old-time { color: #dc2626; text-decoration: line-through; }
        .new-time { color: #059669; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .status-badge { background: #2563eb; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Appointment Rescheduled</h1>
            <p>{{ $clinic->name }}</p>
        </div>

        <div class="content">
            <h2>Patient Rescheduled Appointment</h2>
            <p>A patient has rescheduled their appointment. Please review the changes below:</p>

            <div class="appointment-details">
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge">RESCHEDULED</span>
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
                    <span class="detail-label">Rescheduled At:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::now()->format('l, F j, Y \a\t g:i A') }}</span>
                </div>
            </div>

            <div class="time-change">
                <h3>🕐 Time Change Details:</h3>
                <p><strong>From:</strong> <span class="old-time">{{ \Carbon\Carbon::parse($oldScheduledAt ?? $appointment->scheduled_at)->format('l, F j, Y \a\t g:i A') }}</span></p>
                <p><strong>To:</strong> <span class="new-time">{{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('l, F j, Y \a\t g:i A') }}</span></p>
            </div>

            @if($appointment->notes && str_contains($appointment->notes, 'Rescheduled by patient'))
            <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #0ea5e9;">
                <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">📝 Patient's Reason:</h3>
                <p style="margin: 0; color: #0c4a6e;"><em>{{ explode('Reason: ', $appointment->notes)[1] ?? 'No reason provided' }}</em></p>
            </div>
            @endif

            <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #22c55e;">
                <h3 style="color: #166534; margin: 0 0 10px 0;">✅ Action Required</h3>
                <p style="margin: 0; color: #166534;">Please confirm the new appointment time works for your schedule:</p>
                <ul style="margin: 10px 0 0 0; color: #166534;">
                    <li>Verify dentist availability</li>
                    <li>Check for any scheduling conflicts</li>
                    <li>Update your calendar if needed</li>
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
