<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Renewal Request Confirmation</title>
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
        .success-box {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .info-box {
            background: #e3f2fd;
            border: 1px solid #2196f3;
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
        <p>Renewal Request Confirmation</p>
    </div>

    <div class="content">
        <div class="success-box">
            <h2>✅ Renewal Request Received!</h2>
            <p>Hello {{ $clinic->name }},</p>
            <p>We have received your subscription renewal request and will process it within 24 hours.</p>
        </div>

        <div class="info-box">
            <h3>Request Summary</h3>
            <p><strong>Current Plan:</strong> {{ ucfirst($clinic->subscription_plan) }}</p>
            <p><strong>Current Status:</strong> {{ ucfirst($clinic->subscription_status) }}</p>
            <p><strong>Current End Date:</strong> {{ $clinic->subscription_end_date ? $clinic->subscription_end_date->format('F j, Y g:i A') : 'N/A' }}</p>
            <p><strong>Requested Duration:</strong> {{ $renewalData['duration_months'] }} month(s)</p>
            @if(isset($renewalData['message']) && $renewalData['message'])
                <p><strong>Your Message:</strong> {{ $renewalData['message'] }}</p>
            @endif
        </div>

        <h3>What happens next?</h3>
        <ol>
            <li><strong>Review (24 hours):</strong> Our team will review your request</li>
            <li><strong>Payment Instructions:</strong> You'll receive payment instructions via email</li>
            <li><strong>Complete Payment:</strong> Use the provided payment methods</li>
            <li><strong>Instant Renewal:</strong> Your subscription will be renewed immediately</li>
        </ol>

        <h3>Need immediate assistance?</h3>
        <p>If you need urgent help or have questions, please contact us:</p>
        <ul>
            <li>📧 Email: support@smilesuite.com</li>
            <li>📞 Phone: +63 123 456 7890</li>
            <li>💬 Live Chat: Available on our website</li>
        </ul>

        <p><strong>Request Date:</strong> {{ now()->format('F j, Y g:i A') }}</p>
        <p><strong>Reference ID:</strong> RENEWAL-{{ $clinic->id }}-{{ now()->format('Ymd') }}</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>Thank you for choosing Smile Suite!</p>
    </div>
</body>
</html>

