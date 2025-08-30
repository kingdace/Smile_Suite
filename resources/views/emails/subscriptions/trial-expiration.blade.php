<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Trial Expiration Notice</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
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
        <h1>🦷 Smile Suite</h1>
        <p>Your Dental Practice Management System</p>
    </div>

    <div class="content">
        <h2>Hello {{ $clinic->name }}!</h2>

        <div class="warning">
            <strong>⚠️ Trial Expiration Notice</strong>
            <p>Your free trial will expire in <strong>{{ $daysLeft }} day{{ $daysLeft > 1 ? 's' : '' }}</strong>.</p>
        </div>

        <p>We hope you've been enjoying Smile Suite and finding it valuable for managing your dental practice. To continue using all the features and benefits, you'll need to upgrade to a paid subscription.</p>

        <h3>What happens when your trial expires?</h3>
        <ul>
            <li>You'll enter a 7-day grace period where you can still access your data</li>
            <li>After the grace period, your account will be suspended</li>
            <li>All your data will be preserved and safe</li>
            <li>You can reactivate anytime by upgrading to a paid plan</li>
        </ul>

        <h3>Choose Your Plan:</h3>
        <div style="display: flex; gap: 20px; margin: 20px 0;">
            <div style="flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
                <h4>Basic Plan</h4>
                <p><strong>₱999/month</strong></p>
                <ul>
                    <li>Up to 2 dentist accounts</li>
                    <li>Basic patient management</li>
                    <li>Appointment scheduling</li>
                    <li>Basic reporting</li>
                </ul>
            </div>
            <div style="flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
                <h4>Premium Plan</h4>
                <p><strong>₱1,999/month</strong></p>
                <ul>
                    <li>Up to 5 dentist accounts</li>
                    <li>Advanced features</li>
                    <li>Inventory management</li>
                    <li>Priority support</li>
                </ul>
            </div>
        </div>

        <div style="text-align: center;">
            <a href="{{ route('admin.subscriptions.index') }}" class="button">Upgrade Now</a>
        </div>

        <p><strong>Need help?</strong> Contact our support team at support@smilesuite.com or call us at +63 123 456 7890.</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>This email was sent to {{ $clinic->email }}</p>
    </div>
</body>
</html>
