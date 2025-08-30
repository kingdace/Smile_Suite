<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Grace Period Notice</title>
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
            background: #ff6b6b;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .warning {
            background: #ffeaa7;
            border: 1px solid #fdcb6e;
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
            <strong>⚠️ Grace Period Notice</strong>
            <p>Your subscription has expired and you are now in a <strong>7-day grace period</strong>.</p>
        </div>

        <p>Your Smile Suite subscription has expired, but don't worry! We've automatically placed your account in a <strong>7-day grace period</strong> to ensure you don't lose access to your important practice data.</p>

        <h3>What you need to know:</h3>
        <ul>
            <li><strong>You can still access your data</strong> during the grace period</li>
            <li><strong>All your information is safe</strong> and will not be deleted</li>
            <li><strong>You have 7 days</strong> to renew your subscription</li>
            <li><strong>After 7 days</strong>, your account will be suspended</li>
        </ul>

        <h3>Why renew now?</h3>
        <ul>
            <li>Continue managing your dental practice without interruption</li>
            <li>Access all your patient records and appointment data</li>
            <li>Maintain your practice's workflow and efficiency</li>
            <li>Avoid any potential data access issues</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ route('admin.subscriptions.index') }}" class="button">Renew Now - Don't Lose Access</a>
        </div>

        <p><strong>Need immediate assistance?</strong></p>
        <ul>
            <li>Email: support@smilesuite.com</li>
            <li>Phone: +63 123 456 7890</li>
            <li>Live Chat: Available on our website</li>
        </ul>

        <p><strong>We're here to help you get back up and running quickly!</strong></p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>This email was sent to {{ $clinic->email }}</p>
    </div>
</body>
</html>

