<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reschedule Request Update</title>
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
            border-bottom: 3px solid #f59e0b;
        }
        .header h1 {
            color: #f59e0b;
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
            border-left: 4px solid #f59e0b;
        }
        .appointment-details h3 {
            color: #f59e0b;
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
        .info-message {
            background-color: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #fde68a;
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
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 5px;
        }
        .button:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Reschedule Request Update</h1>
            <p>Your appointment reschedule request has been reviewed</p>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $patientName }}</strong>,</p>

            <p>Thank you for your reschedule request. After careful consideration, we're unable to accommodate your requested time change at this moment.</p>

            <div class="info-message">
                <strong>ℹ️ Your appointment will remain at its original time.</strong>
            </div>

            <div class="appointment-details">
                <h3>📅 Current Appointment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value"><strong>{{ $originalScheduledAt }}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Clinic:</span>
                    <span class="detail-value">{{ $clinicName }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #3b82f6; font-weight: bold;">✅ Confirmed</span>
                </div>
                @if($denialReason && $denialReason !== 'No specific reason provided')
                <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value">{{ $denialReason }}</span>
                </div>
                @endif
            </div>

            <div class="contact-info">
                <h3>📞 Need to Discuss Further?</h3>
                <p>We understand that scheduling can be challenging. If you have any concerns or need to discuss alternative arrangements, please don't hesitate to contact us:</p>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ $clinicPhone }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{ $clinicEmail }}</span>
                </div>
                <p style="margin-top: 15px;">
                    <a href="tel:{{ $clinicPhone }}" class="button">Call Now</a>
                    <a href="mailto:{{ $clinicEmail }}" class="button">Send Email</a>
                </p>
            </div>

            <p>We appreciate your understanding and look forward to seeing you at your scheduled appointment.</p>

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
