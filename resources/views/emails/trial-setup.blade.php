<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>🎉 Your 14-Day Free Trial is Ready - Complete Your Clinic Setup</title>
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
        .trial-message {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .trial-message h2 {
            color: #065f46;
            margin: 0 0 8px 0;
            font-size: 20px;
        }
        .trial-message p {
            color: #047857;
            margin: 0;
            font-weight: 500;
        }
        .trial-details {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .trial-details h3 {
            color: #92400e;
            margin: 0 0 12px 0;
            font-size: 18px;
        }
        .trial-details ul {
            color: #92400e;
            margin: 0;
            padding-left: 20px;
        }
        .trial-details li {
            margin-bottom: 8px;
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
        }
        .admin-notes p {
            color: #92400e;
            margin: 0;
        }
        .clinic-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .clinic-details h3 {
            color: #2d3748;
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
            color: #4a5568;
            font-weight: 600;
        }
        .details-list span {
            color: #2d3748;
            font-weight: 500;
        }
        .section-title {
            color: #2d3748;
            font-size: 20px;
            font-weight: 700;
            margin: 32px 0 16px 0;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .setup-steps {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .setup-steps ol {
            margin: 0;
            padding-left: 20px;
            color: #4a5568;
        }
        .setup-steps li {
            margin-bottom: 12px;
            line-height: 1.5;
        }
        .setup-steps strong {
            color: #2d3748;
        }
        .setup-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
        }
        .setup-link h3 {
            color: white;
            margin: 0 0 12px 0;
            font-size: 20px;
        }
        .setup-link p {
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 20px 0;
        }
        .setup-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .setup-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .security-note {
            background: #fef5e7;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .security-note strong {
            color: #c05621;
        }
        .contact-info {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .contact-info p {
            margin: 8px 0;
            color: #22543d;
        }
        .contact-info a {
            color: #38a169;
            text-decoration: none;
            font-weight: 600;
        }
        .closing {
            text-align: center;
            color: #4a5568;
            margin-bottom: 24px;
        }
        .closing p {
            margin: 8px 0;
        }
        .footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 24px;
            font-size: 14px;
        }
        .footer p {
            margin: 4px 0;
            opacity: 0.8;
        }
        .trial-badge {
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-left: 8px;
        }
        .expiry-info {
            background: #fef5e7;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .expiry-info h4 {
            color: #c05621;
            margin: 0 0 8px 0;
            font-size: 16px;
        }
        .expiry-info p {
            color: #92400e;
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="{{ asset('images/clinic-logo.png') }}" alt="Smile Suite" class="logo">
            </div>
            <h1>🎉 Your Free Trial is Ready!</h1>
            <p>Complete Your Clinic Setup - 14 Days Free</p>
        </div>

        <div class="content">
            <div class="greeting">
                <h2>Dear {{ $request->contact_person }},</h2>
            </div>

            <div class="trial-message">
                <h2>Congratulations! 🎊</h2>
                <p>Your <strong>{{ $request->clinic_name }}</strong> has been approved for a <strong>14-day free trial</strong>!</p>
            </div>

            <div class="trial-details">
                <h3>🎁 What's Included in Your Free Trial:</h3>
                <ul>
                    <li><strong>Full access</strong> to all Basic plan features</li>
                    <li><strong>Up to 2 dentist accounts</strong> for your team</li>
                    <li><strong>Patient management</strong> and appointment scheduling</li>
                    <li><strong>Basic reporting</strong> and analytics</li>
                    <li><strong>Email support</strong> throughout your trial</li>
                    <li><strong>No credit card required</strong> - completely free!</li>
                </ul>
            </div>

            <div class="expiry-info">
                <h4>⏰ Trial Period</h4>
                <p><strong>Start Date:</strong> {{ now()->format('F j, Y') }}</p>
                <p><strong>End Date:</strong> {{ now()->addDays(14)->format('F j, Y') }}</p>
                <p><strong>Duration:</strong> 14 days of full access</p>
            </div>

            @if($request->admin_notes)
            <div class="admin-notes">
                <h3>📝 Message from Our Team</h3>
                <p>{{ $request->admin_notes }}</p>
            </div>
            @endif

            <div class="clinic-details">
                <h3>📋 Your Clinic Details</h3>
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
                        <span>{{ ucfirst($request->subscription_plan) }} <span class="trial-badge">TRIAL</span></span>
                    </li>
                    <li>
                        <strong>Trial Status:</strong>
                        <span>Active - 14 days remaining</span>
                    </li>
                </ul>
            </div>

            <h3 class="section-title">🚀 Quick Setup Process</h3>
            <p>Your clinic and admin account have been created automatically. Now you just need to complete the setup:</p>

            <div class="setup-steps">
                <ol>
                    <li><strong>Complete your clinic profile</strong> with complete information</li>
                    <li><strong>Set your admin password</strong> for secure access</li>
                    <li><strong>Configure your clinic settings</strong> and preferences</li>
                    <li><strong>Add your staff members</strong> and assign roles</li>
                    <li><strong>Start managing patients</strong> and appointments</li>
                </ol>
            </div>

            <div class="setup-link">
                <h3>🔗 Complete Your Setup</h3>
                <p>Click the button below to start setting up your clinic:</p>
                <a href="{{ route('clinic.setup', ['token' => $request->approval_token]) }}" class="setup-button">
                    🚀 Start Clinic Setup
                </a>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 16px 0 0 0;">
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
                <p>Enjoy your 14-day free trial and experience the full power of Smile Suite!</p>
                <p>Best regards,<br>
                <strong>The Smile Suite Team</strong></p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Smile Suite</strong> - Dental Practice Management System</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
