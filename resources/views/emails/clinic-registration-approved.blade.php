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

        .payment-button-container {
            text-align: center;
            margin: 24px 0;
        }

        .payment-button {
            display: inline-block;
            background: #ffffff;
            color: #166534;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }

        .payment-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .payment-methods-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 20px 0;
        }

        .payment-method-item {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 12px;
            transition: all 0.2s ease;
        }

        .payment-method-item:hover {
            border-color: #22c55e;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
        }

        .method-icon {
            font-size: 24px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0fdf4;
            border-radius: 8px;
        }

        .method-info {
            flex: 1;
        }

        .method-info strong {
            display: block;
            color: #166534;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .method-info span {
            display: block;
            color: #15803d;
            font-size: 12px;
        }

        .payment-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
        }

        .feature {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #166534;
        }

        .feature-icon {
            font-size: 16px;
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
            .payment-methods-grid {
                grid-template-columns: 1fr;
                gap: 8px;
            }
            .payment-features {
                grid-template-columns: 1fr;
                gap: 8px;
            }
            .payment-button {
                padding: 14px 24px;
                font-size: 16px;
            }
        }
        .payment-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .payment-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .payment-list li:last-child {
            border-bottom: none;
        }
        .payment-list strong {
            color: #475569;
            font-weight: 600;
        }
        .payment-list span {
            color: #1e293b;
            font-weight: 500;
        }
        .deadline-warning {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 2px solid #dc2626;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .deadline-warning h3 {
            color: #991b1b;
            margin: 0 0 16px 0;
            font-size: 20px;
            text-align: center;
        }
        .deadline-alert {
            background: #dc2626;
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
        }
        .deadline-alert p {
            margin: 8px 0;
            font-weight: 600;
        }
        .deadline-time {
            font-size: 18px;
            font-weight: 700;
            color: #fbbf24;
        }
        .deadline-consequences {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .deadline-consequences p {
            color: #92400e;
            margin: 8px 0;
            font-weight: 600;
        }
        .deadline-consequences ul {
            color: #92400e;
            margin: 8px 0;
            padding-left: 20px;
        }
        .deadline-consequences li {
            margin: 4px 0;
        }
        .deadline-action {
            background: #10b981;
            color: white;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }
        .deadline-action p {
            margin: 0;
            font-weight: 600;
            font-size: 16px;
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

            <h3 class="section-title">🚀 Quick Setup Process</h3>
            <div class="steps-list">
                <ol>
                    <li><strong>Complete Payment:</strong> Choose your preferred payment method below</li>
                    <li><strong>Instant Confirmation:</strong> Payment is processed immediately</li>
                    <li><strong>Setup Email:</strong> Receive clinic setup instructions instantly</li>
                </ol>
            </div>

            <h3 class="section-title">💳 Complete Your Payment</h3>
            <div class="payment-card">
                <h3>🇵🇭 Philippine Payment Options</h3>

                <p class="payment-description">
                    Choose your preferred payment method. All options are secure and instant!
                </p>

                <div class="payment-button-container">
                    <a href="{{ route('payment.show', ['token' => $request->approval_token]) }}"
                       class="payment-button">
                        🚀 Complete Payment - ₱{{ number_format($request->subscription_amount, 2) }}
                    </a>
                </div>

                <div class="payment-methods-grid">
                    <div class="payment-method-item">
                        <div class="method-icon">📱</div>
                        <div class="method-info">
                            <strong>GCash</strong>
                            <span>Send to GCash number</span>
                        </div>
                    </div>
                    <div class="payment-method-item">
                        <div class="method-icon">📱</div>
                        <div class="method-info">
                            <strong>PayMaya</strong>
                            <span>Send to PayMaya number</span>
                        </div>
                    </div>
                    <div class="payment-method-item">
                        <div class="method-icon">🏦</div>
                        <div class="method-info">
                            <strong>Bank Transfer</strong>
                            <span>Transfer to BDO account</span>
                        </div>
                    </div>
                    <div class="payment-method-item">
                        <div class="method-icon">💳</div>
                        <div class="method-info">
                            <strong>Credit Card</strong>
                            <span>Secure card processing</span>
                        </div>
                    </div>
                </div>

                <div class="payment-features">
                    <div class="feature">
                        <span class="feature-icon">🔒</span>
                        <span>Bank-level security encryption</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⚡</span>
                        <span>Instant payment processing</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📧</span>
                        <span>Setup email sent immediately</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🎯</span>
                        <span>Philippine-focused payment</span>
                    </div>
                </div>
            </div>

            <div class="important-note">
                <strong>⚡ Instant Setup:</strong> Complete your payment now to receive clinic setup instructions immediately. No waiting time!
            </div>

            <div class="payment-details">
                <h3>💰 Payment Details</h3>
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
                        <strong>Amount Due:</strong>
                        <span>₱{{ number_format($request->subscription_amount, 2) }}</span>
                    </li>
                    @if($request->payment_deadline)
                    <li>
                        <strong>Payment Deadline:</strong>
                        <span style="color: #dc2626; font-weight: 600;">{{ $request->payment_deadline->format('F j, Y g:i A') }}</span>
                    </li>
                    @endif
                </ul>
            </div>

            @if($request->payment_deadline)
            <div class="deadline-warning">
                <h3>⏰ URGENT: Payment Deadline</h3>
                <div class="deadline-alert">
                    <p><strong>⚠️ YOUR PAYMENT MUST BE COMPLETED BY:</strong></p>
                    <p class="deadline-time">{{ $request->payment_deadline->format('F j, Y g:i A') }}</p>
                </div>
                <div class="deadline-consequences">
                    <p><strong>What happens if you don't pay on time?</strong></p>
                    <ul>
                        <li>❌ Your registration will be automatically cancelled</li>
                        <li>❌ You'll need to submit a new registration request</li>
                        <li>❌ You may lose your spot in the approval queue</li>
                        <li>❌ Additional processing time will be required</li>
                    </ul>
                </div>
                <div class="deadline-action">
                    <p><strong>🚀 ACT NOW:</strong> Complete your payment immediately to secure your clinic registration!</p>
                </div>
            </div>
            @endif

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
