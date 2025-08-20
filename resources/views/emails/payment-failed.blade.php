<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Failed - Smile Suite Registration</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 650px;
            margin: 0 auto;
            padding: 0;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }
        .container {
            background: white;
            margin: 20px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .logo-container {
            position: relative;
            z-index: 2;
            margin-bottom: 20px;
        }
        .logo {
            width: 90px;
            height: 90px;
            border-radius: 16px;
            background: white;
            padding: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: inline-block;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
            position: relative;
            z-index: 2;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
            position: relative;
            z-index: 2;
        }
        .content {
            padding: 40px 30px;
            background: white;
        }
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 24px;
        }
        .status-message {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #dc2626;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .status-message h2 {
            color: #991b1b;
            margin: 0 0 8px 0;
            font-size: 20px;
        }
        .status-message p {
            color: #b91c1b;
            margin: 0;
            font-weight: 500;
        }
        .admin-notes {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .admin-notes h3 {
            color: #92400e;
            margin: 0 0 8px 0;
            font-size: 16px;
        }
        .admin-notes p {
            color: #a16207;
            margin: 0;
        }
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .details-card h3 {
            color: #1e293b;
            margin: 0 0 16px 0;
            font-size: 18px;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .details-list li:last-child {
            border-bottom: none;
        }
        .details-list strong {
            color: #475569;
            font-weight: 600;
        }
        .details-list span {
            color: #1e293b;
            font-weight: 500;
        }
        .section-title {
            color: #1e293b;
            margin: 24px 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .next-steps {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .next-steps p {
            color: #0c4a6e;
            margin: 0 0 12px 0;
        }
        .next-steps ol {
            color: #0c4a6e;
            margin: 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
        }
        .retry-button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
        }
        .retry-button:hover {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            transform: translateY(-1px);
        }
        .contact-info {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #16a34a;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .contact-info p {
            color: #15803d;
            margin: 0 0 8px 0;
        }
        .contact-info a {
            color: #16a34a;
            text-decoration: none;
            font-weight: 600;
        }
        .closing {
            text-align: center;
            margin-top: 32px;
        }
        .closing p {
            color: #64748b;
            margin: 0 0 8px 0;
        }
        .footer {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #64748b;
            margin: 0 0 4px 0;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="{{ asset('images/clinic-logo.png') }}" alt="Smile Suite" class="logo">
            </div>
            <h1>❌ Payment Failed</h1>
            <p>Your payment could not be processed</p>
        </div>

        <div class="content">
            <div class="greeting">
                <h2>Dear {{ $request->contact_person }},</h2>
            </div>

            <div class="status-message">
                <h2>❌ Payment Processing Failed</h2>
                <p>We were unable to process your payment for <strong>{{ $request->clinic_name }}</strong>.</p>
            </div>

            @if($request->admin_notes)
            <div class="admin-notes">
                <h3>📝 Additional Information</h3>
                <p>{{ $request->admin_notes }}</p>
            </div>
            @endif

            <div class="details-card">
                <h3>📋 Registration Details</h3>
                <ul class="details-list">
                    <li>
                        <strong>Clinic Name:</strong>
                        <span>{{ $request->clinic_name }}</span>
                    </li>
                    <li>
                        <strong>Contact Person:</strong>
                        <span>{{ $request->contact_person }}</span>
                    </li>
                    <li>
                        <strong>Email Address:</strong>
                        <span>{{ $request->email }}</span>
                    </li>
                    <li>
                        <strong>Subscription Plan:</strong>
                        <span>{{ ucfirst($request->subscription_plan) }}</span>
                    </li>
                    <li>
                        <strong>Amount Due:</strong>
                        <span>₱{{ number_format($request->subscription_amount, 2) }}</span>
                    </li>
                    <li>
                        <strong>Request ID:</strong>
                        <span>{{ $request->id }}</span>
                    </li>
                </ul>
            </div>

            <h3 class="section-title">🔄 How to Resolve This Issue</h3>
            <div class="next-steps">
                <p>To complete your clinic registration, please follow these steps:</p>
                <ol>
                    <li><strong>Check your payment method</strong> - Ensure your card/bank account has sufficient funds</li>
                    <li><strong>Verify payment details</strong> - Double-check the amount and payment information</li>
                    <li><strong>Contact your bank</strong> - Some banks may block online payments for security</li>
                    <li><strong>Try alternative payment method</strong> - Use a different card or payment option</li>
                </ol>
            </div>

            <div style="text-align: center; margin: 24px 0;">
                <a href="{{ route('payment.process', ['token' => $request->approval_token]) }}" class="retry-button">
                    🔄 Retry Payment
                </a>
                <p style="font-size: 14px; color: #6b7280; margin-top: 12px;">
                    Click above to try your payment again with the same registration details.
                </p>
            </div>

            <div class="contact-info">
                <p>Need help with payment? Contact our support team at <a href="mailto:support@smilesuite.com">support@smilesuite.com</a></p>
                <p>We typically respond within 2-4 hours during business days.</p>
            </div>

            <div class="closing">
                <p>We're here to help you complete your registration successfully.</p>
                <p>Best regards,<br>
                <strong>The Smile Suite Team</strong></p>
            </div>
        </div>

        <div class="footer">
            <p>This email was sent to {{ $request->email }}</p>
            <p><strong>Smile Suite</strong> - Dental Practice Management System</p>
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
