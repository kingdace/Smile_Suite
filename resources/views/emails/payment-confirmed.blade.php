<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Confirmed - Complete Your Clinic Setup</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
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
        .success-message {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .success-message h2 {
            color: #065f46;
            margin: 0 0 8px 0;
            font-size: 20px;
        }
        .success-message p {
            color: #047857;
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
            margin: 0 0 12px 0;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .admin-notes p {
            color: #78350f;
            margin: 0;
            font-style: italic;
            line-height: 1.5;
        }
        .payment-details {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #22c55e;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .payment-details h3 {
            color: #166534;
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .payment-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .payment-list li {
            padding: 8px 0;
            border-bottom: 1px solid #bbf7d0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .payment-list li:last-child {
            border-bottom: none;
        }
        .payment-list strong {
            color: #15803d;
            font-weight: 600;
        }
        .payment-list span {
            color: #166534;
            font-weight: 500;
        }
        .section-title {
            color: #1e293b;
            font-size: 20px;
            font-weight: 600;
            margin: 32px 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .setup-steps {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .setup-steps ol {
            margin: 0;
            padding-left: 20px;
        }
        .setup-steps li {
            margin-bottom: 12px;
            color: #0c4a6e;
            font-weight: 500;
        }
        .setup-link {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px dashed #f59e0b;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: center;
        }
        .setup-link h3 {
            color: #92400e;
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .setup-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 16px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        .setup-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .security-note {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #ef4444;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .security-note strong {
            color: #991b1b;
            font-size: 16px;
        }
        .contact-info {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .contact-info a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        .closing {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        .closing p {
            color: #475569;
            margin: 0 0 8px 0;
        }
        .closing strong {
            color: #1e293b;
        }
        .footer {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: #cbd5e1;
            text-align: center;
            padding: 24px 30px;
            font-size: 14px;
        }
        .footer p {
            margin: 0 0 8px 0;
        }
        .footer p:last-child {
            margin-bottom: 0;
        }
        .footer a {
            color: #60a5fa;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            body {
                margin: 0;
            }
            .container {
                margin: 0;
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
            <h1>✅ Payment Confirmed!</h1>
            <p>Complete Your Clinic Setup</p>
        </div>

        <div class="content">
            <div class="greeting">
                <h2>Dear {{ $request->contact_person }},</h2>
            </div>

            <div class="success-message">
                <h2>Excellent! 🎊</h2>
                <p>We have received and confirmed your payment for <strong>{{ $request->clinic_name }}</strong>.</p>
            </div>

            @if($request->admin_notes)
            <div class="admin-notes">
                <h3>📝 Message from Our Team</h3>
                <p>{{ $request->admin_notes }}</p>
            </div>
            @endif

            <div class="payment-details">
                <h3>💰 Payment Confirmation</h3>
                <ul class="payment-list">
                    <li>
                        <strong>Clinic Name:</strong>
                        <span>{{ $request->clinic_name }}</span>
                    </li>
                    <li>
                        <strong>Reference Number:</strong>
                        <span>{{ $request->id }}</span>
                    </li>
                    <li>
                        <strong>Subscription Plan:</strong>
                        <span>{{ ucfirst($request->subscription_plan) }}</span>
                    </li>
                    <li>
                        <strong>Amount Paid:</strong>
                        <span>₱{{ number_format($request->subscription_amount, 2) }}</span>
                    </li>
                    <li>
                        <strong>Payment Date:</strong>
                        <span>{{ now()->format('F j, Y') }}</span>
                    </li>
                </ul>
            </div>

            <h3 class="section-title">🎉 You're Almost There!</h3>
            <p>Now it's time to complete your clinic setup and start using Smile Suite. You'll need to:</p>

            <div class="setup-steps">
                <ol>
                    <li><strong>Set up your clinic profile</strong> with complete information</li>
                    <li><strong>Create your admin account</strong> with email and password</li>
                    <li><strong>Configure your clinic settings</strong> and preferences</li>
                    <li><strong>Add your staff members</strong> and assign roles</li>
                </ol>
            </div>

            <div class="setup-link">
                <h3>🔗 Complete Your Setup</h3>
                <p>Click the button below to start setting up your clinic:</p>
                <a href="{{ route('clinic.setup', ['token' => $request->approval_token]) }}" class="setup-button">
                    🚀 Start Clinic Setup
                </a>
                <p style="font-size: 14px; color: #92400e; margin: 16px 0 0 0;">
                    This link is secure and will expire in 7 days for your protection.
                </p>
            </div>

            <div class="security-note">
                <strong>🔒 Security Note:</strong> This setup link is unique to your clinic and should not be shared with others.
            </div>

            <div class="contact-info">
                <p>Need assistance with setup? Contact our support team at <a href="mailto:support@smilesuite.com">support@smilesuite.com</a></p>
                <p>We typically respond within 2-4 hours during business days.</p>
            </div>

            <div class="closing">
                <p>Welcome to the Smile Suite family! We're excited to help you streamline your dental practice.</p>
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
