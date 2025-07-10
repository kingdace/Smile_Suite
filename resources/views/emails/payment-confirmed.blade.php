<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Confirmed - Complete Clinic Setup</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .button:hover {
            background: #0056b3;
        }
        .details {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .setup-link {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #28a745;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Payment Confirmed!</h1>
        <p>Complete Your Clinic Setup</p>
    </div>

    <div class="content">
        <h2>Dear {{ $request->contact_person }},</h2>

        <p>Excellent! We have received and confirmed your payment for <strong>{{ $request->clinic_name }}</strong>.</p>

        <div class="details">
            <h3>Payment Confirmation:</h3>
            <ul>
                <li><strong>Clinic Name:</strong> {{ $request->clinic_name }}</li>
                <li><strong>Reference Number:</strong> {{ $request->id }}</li>
                <li><strong>Subscription Plan:</strong> {{ ucfirst($request->subscription_plan) }}</li>
                <li><strong>Amount Paid:</strong> ₱{{ number_format($request->subscription_amount, 2) }}</li>
                <li><strong>Payment Date:</strong> {{ now()->format('F j, Y') }}</li>
            </ul>
        </div>

        <h3>🎉 You're Almost There!</h3>
        <p>Now it's time to complete your clinic setup and start using Smile Suite. You'll need to:</p>

        <ol>
            <li><strong>Set up your clinic profile</strong> with complete information</li>
            <li><strong>Create your admin account</strong> with email and password</li>
            <li><strong>Configure your clinic settings</strong> and preferences</li>
            <li><strong>Add your staff members</strong> and assign roles</li>
        </ol>

        <div class="setup-link">
            <h3>🔗 Complete Your Setup</h3>
            <p>Click the button below to access your clinic setup page:</p>
            <a href="{{ route('clinic.setup', ['token' => $request->approval_token]) }}" class="button">
                Complete Clinic Setup
            </a>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">
                This link will expire in 7 days for security purposes.
            </p>
        </div>

        <h3>What You'll Set Up:</h3>
        <div class="details">
            <ul>
                <li><strong>Clinic Profile:</strong> Logo, contact details, operating hours</li>
                <li><strong>Admin Account:</strong> Your login credentials and profile</li>
                <li><strong>Staff Management:</strong> Add dentists, assistants, and receptionists</li>
                <li><strong>Services & Pricing:</strong> Configure your dental services</li>
                <li><strong>System Preferences:</strong> Customize your dashboard and notifications</li>
            </ul>
        </div>

        <h3>Need Help?</h3>
        <p>Our support team is here to help you get started:</p>
        <ul>
            <li><strong>Email:</strong> <a href="mailto:support@smilesuite.com">support@smilesuite.com</a></li>
            <li><strong>Phone:</strong> +63 917 123 4567</li>
            <li><strong>Live Chat:</strong> Available on our website</li>
        </ul>

        <p>We also offer a <strong>free onboarding session</strong> to help you get the most out of Smile Suite. Our team will guide you through the setup process and answer any questions you may have.</p>

        <p>Welcome to the Smile Suite family! We're excited to help you streamline your dental practice.</p>

        <p>Best regards,<br>
        <strong>The Smile Suite Team</strong></p>
    </div>

    <div class="footer">
        <p>This email was sent to {{ $request->email }}<br>
        Smile Suite - Dental Practice Management System<br>
        © {{ date('Y') }} Smile Suite. All rights reserved.</p>
    </div>
</body>
</html>
