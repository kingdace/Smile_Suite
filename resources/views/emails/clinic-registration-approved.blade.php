<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Clinic Registration Approved - Smile Suite</title>
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
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
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
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .details-card h3 {
            color: #1e293b;
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            font-size: 20px;
            font-weight: 600;
            margin: 32px 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .steps-list {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .steps-list ol {
            margin: 0;
            padding-left: 20px;
        }
        .steps-list li {
            margin-bottom: 12px;
            color: #0c4a6e;
            font-weight: 500;
        }
        .payment-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #22c55e;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .payment-card h3 {
            color: #166534;
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .payment-method {
            background: white;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .payment-method:last-child {
            margin-bottom: 0;
        }
        .payment-method strong {
            color: #166534;
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .payment-method ul {
            margin: 0;
            padding-left: 20px;
        }
        .payment-method li {
            color: #15803d;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .important-note {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #ef4444;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .important-note strong {
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
            <h1>🎉 Registration Approved!</h1>
            <p>Welcome to the Smile Suite Family</p>
        </div>

        <div class="content">
            <div class="greeting">
                <h2>Dear {{ $request->contact_person }},</h2>
            </div>

            <div class="success-message">
                <h2>Congratulations! 🎊</h2>
                <p>Your clinic registration request for <strong>{{ $request->clinic_name }}</strong> has been approved!</p>
            </div>

            @if($request->admin_notes)
            <div class="admin-notes">
                <h3>📝 Message from Our Team</h3>
                <p>{{ $request->admin_notes }}</p>
            </div>
            @endif

            <div class="details-card">
                <h3>📋 Registration Summary</h3>
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
                        <strong>Setup Fee:</strong>
                        <span>₱{{ number_format($request->subscription_amount, 2) }}</span>
                    </li>
                </ul>
            </div>

            <h3 class="section-title">🚀 Next Steps</h3>
            <div class="steps-list">
                <ol>
                    <li><strong>Complete Payment:</strong> Process your setup fee using the instructions below</li>
                    <li><strong>Payment Confirmation:</strong> Our team will verify your payment within 24 hours</li>
                    <li><strong>Setup Access:</strong> You'll receive setup instructions to complete your clinic configuration</li>
                </ol>
            </div>

            <h3 class="section-title">💳 Payment Instructions</h3>
            <div class="payment-card">
                <h3>Choose Your Payment Method</h3>
                
                <div class="payment-method">
                    <strong>🏦 Bank Transfer (BDO)</strong>
                    <ul>
                        <li>Account Name: Smile Suite Inc.</li>
                        <li>Account Number: 1234-5678-9012</li>
                        <li>Reference Number: <strong>{{ $request->id }}</strong></li>
                    </ul>
                </div>

                <div class="payment-method">
                    <strong>📱 GCash</strong>
                    <ul>
                        <li>Number: 0917-123-4567</li>
                        <li>Name: Smile Suite</li>
                        <li>Reference Number: <strong>{{ $request->id }}</strong></li>
                    </ul>
                </div>
            </div>

            <div class="important-note">
                <strong>⚠️ Important:</strong> Please include your reference number <strong>{{ $request->id }}</strong> in your payment to ensure proper processing.
            </div>

            <div class="contact-info">
                <p>Need help? Contact our support team at <a href="mailto:support@smilesuite.com">support@smilesuite.com</a></p>
                <p>We typically respond within 2-4 hours during business days.</p>
            </div>

            <div class="closing">
                <p>We're excited to have you join the Smile Suite family!</p>
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
