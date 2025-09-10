<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reschedule Approved</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #10B981;
        }
        .header h1 {
            color: #10B981;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .appointment-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10B981;
        }
        .appointment-details h3 {
            color: #10B981;
            margin-top: 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #6b7280;
        }
        .detail-value {
            color: #374151;
        }
        .success-message {
            background-color: #d1fae5;
            color: #065f46;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #a7f3d0;
        }
        .contact-info {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .contact-info h3 {
            color: #3b82f6;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #10B981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 5px;
        }
        .button:hover {
            background-color: #059669;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Reschedule Approved!</h1>
            <p>Your appointment reschedule request has been approved</p>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $patientName }}</strong>,</p>

            <p>Great news! Your reschedule request has been approved by <strong>{{ $clinicName }}</strong>.</p>

            <div class="success-message">
                <strong>🎉 Your appointment has been successfully rescheduled!</strong>
            </div>

            <div class="appointment-details">
                <h3>📅 Updated Appointment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">New Date & Time:</span>
                    <span class="detail-value"><strong>{{ $newScheduledAt }}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Clinic:</span>
                    <span class="detail-value">{{ $clinicName }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #10B981; font-weight: bold;">✅ Confirmed</span>
                </div>
            </div>

            <div class="contact-info">
                <h3>📞 Need to Make Changes?</h3>
                <p>If you need to make any further changes to your appointment, please contact us:</p>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ $clinicPhone }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $clinicEmail }}</span>
                </div>
            </div>

            <p>We look forward to seeing you at your rescheduled appointment!</p>

            <p>Best regards,<br>
            <strong>{{ $clinicName }} Team</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated message from Smile Suite. Please do not reply to this email.</p>
            <p>If you have any questions, please contact the clinic directly.</p>
        </div>
    </div>
</body>
</html>
