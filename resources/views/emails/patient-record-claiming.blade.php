<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Patient Records - Smile Suite</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .title {
            color: #1e40af;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .verification-code {
            background-color: #f3f4f6;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 2px;
        }
        .instructions {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
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
            font-weight: 500;
            margin: 10px 0;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/smile-suite-logo.png') }}" alt="Smile Suite" class="logo">
            <div class="title">Verify Your Patient Records</div>
            <div class="subtitle">Complete your Smile Suite registration</div>
        </div>

        <div class="content">
            <p>Hello!</p>

            <p>We found existing patient records associated with your email address. To complete your Smile Suite registration and link these records to your account, please use the verification code below:</p>

            <div class="verification-code">
                {{ $verificationToken }}
            </div>

            <div class="instructions">
                <strong>How to complete your registration:</strong>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Return to the Smile Suite registration page</li>
                    <li>Enter the verification code above</li>
                    <li>Complete your registration form</li>
                    <li>Your existing patient records will be automatically linked</li>
                </ol>
            </div>

            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This verification code will expire in 24 hours. If you didn't request this verification, please ignore this email.
            </div>

            <p>If you have any questions or need assistance, please contact our support team.</p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
            <p>This email was sent to verify your patient record claiming request.</p>
        </div>
    </div>
</body>
</html>
