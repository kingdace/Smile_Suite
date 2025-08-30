<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Suspension Notice</title>
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
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
            background: #e74c3c;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .warning {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
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
            <strong>🚫 Account Suspension Notice</strong>
            <p>Your Smile Suite account has been <strong>suspended</strong> due to non-payment.</p>
        </div>

        <p>We regret to inform you that your Smile Suite account has been suspended due to non-payment. This means you currently cannot access your practice management system.</p>

        <h3>What this means:</h3>
        <ul>
            <li><strong>Your account is temporarily suspended</strong></li>
            <li><strong>All your data is safe</strong> and will not be deleted</li>
            <li><strong>You cannot access the system</strong> until payment is received</li>
            <li><strong>Patient data and records are preserved</strong></li>
        </ul>

        <h3>How to reactivate your account:</h3>
        <ol>
            <li><strong>Contact our support team</strong> to discuss payment options</li>
            <li><strong>Complete the payment process</strong></li>
            <li><strong>Your account will be reactivated immediately</strong></li>
            <li><strong>All your data will be restored</strong></li>
        </ol>

        <div style="text-align: center;">
            <a href="mailto:support@smilesuite.com" class="button">Contact Support to Reactivate</a>
        </div>

        <h3>Payment Options:</h3>
        <ul>
            <li><strong>Credit/Debit Card</strong> - Instant reactivation</li>
            <li><strong>Bank Transfer</strong> - Reactivation within 24 hours</li>
            <li><strong>GCash/PayMaya</strong> - Instant reactivation</li>
        </ul>

        <h3>Need immediate assistance?</h3>
        <p><strong>Our support team is here to help:</strong></p>
        <ul>
            <li>📧 Email: support@smilesuite.com</li>
            <li>📞 Phone: +63 123 456 7890</li>
            <li>💬 Live Chat: Available on our website</li>
            <li>⏰ Support Hours: Monday-Friday, 8 AM - 6 PM</li>
        </ul>

        <p><strong>We understand that payment issues can happen, and we're here to help you get back up and running as quickly as possible.</strong></p>

        <p><strong>Thank you for choosing Smile Suite!</strong></p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>This email was sent to {{ $clinic->email }}</p>
    </div>
</body>
</html>

