<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Instructions</title>
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
        .payment-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
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
        <p>Payment Instructions</p>
    </div>

    <div class="content">
        <div class="success-box">
            <h2>✅ Request Approved!</h2>
            <p>Hello {{ $subscriptionRequest->clinic->name }},</p>
            <p>Your {{ $subscriptionRequest->request_type }} request has been approved! Please complete your payment to proceed.</p>
        </div>

        <div class="payment-box">
            <h3>💰 Payment Details</h3>
            <p><strong>Amount Due:</strong> ₱{{ number_format($subscriptionRequest->calculated_amount, 2) }}</p>
            <p><strong>Request Type:</strong> {{ ucfirst($subscriptionRequest->request_type) }}</p>
            <p><strong>Current Plan:</strong> {{ ucfirst($subscriptionRequest->current_plan) }}</p>
            @if($subscriptionRequest->requested_plan)
                <p><strong>New Plan:</strong> {{ ucfirst($subscriptionRequest->requested_plan) }}</p>
            @endif
            <p><strong>Duration:</strong> {{ $subscriptionRequest->duration_months }} month(s)</p>
            @if($subscriptionRequest->request_type === 'renewal')
                <p><strong>Current End Date:</strong> {{ $subscriptionRequest->clinic->subscription_end_date ? $subscriptionRequest->clinic->subscription_end_date->format('F j, Y') : 'N/A' }}</p>
            @endif
        </div>

        <div class="info-box">
            <h3>💳 Complete Your Payment</h3>
            <p>Click the button below to complete your payment securely:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="{{ route('subscription.payment', ['token' => $subscriptionRequest->payment_token]) }}" class="button">
                    🚀 Complete Payment
                </a>
            </div>
            <p><strong>Payment Deadline:</strong> {{ $subscriptionRequest->payment_deadline->format('F j, Y g:i A') }}</p>
            <p><strong>Reference:</strong> {{ strtoupper($subscriptionRequest->request_type) }}-{{ $subscriptionRequest->id }}-{{ now()->format('Ymd') }}</p>
        </div>

        <h3>📋 Next Steps:</h3>
        <ol>
            <li><strong>Complete Payment:</strong> Use any of the payment methods above</li>
            <li><strong>Include Reference:</strong> Make sure to include the reference number</li>
            <li><strong>Contact Admin:</strong> Email or call to confirm payment</li>
            <li><strong>Instant Activation:</strong> Your subscription will be updated immediately</li>
        </ol>

        @if($subscriptionRequest->request_type === 'renewal')
        <div class="info-box">
            <h4>🔄 Renewal Information</h4>
            <p><strong>What happens after payment:</strong></p>
            <ul>
                <li>Your subscription will be extended by {{ $subscriptionRequest->duration_months }} month(s)</li>
                <li>The new duration will be added to your current subscription period</li>
                <li>You'll maintain access to all your current plan features</li>
            </ul>
        </div>
        @elseif($subscriptionRequest->request_type === 'upgrade')
        <div class="info-box">
            <h4>🚀 Upgrade Information</h4>
            <p><strong>What happens after payment:</strong></p>
            <ul>
                <li>Your plan will be upgraded to {{ ucfirst($subscriptionRequest->requested_plan) }}</li>
                <li>You'll get access to new features and capabilities</li>
                <li>Your subscription will start fresh from the payment date</li>
            </ul>
        </div>
        @endif

        <h3>📞 Contact Information</h3>
        <p>For payment confirmation or questions:</p>
        <ul>
            <li>📧 Email: admin@smilesuite.com</li>
            <li>📞 Phone: +63 123 456 7890</li>
            <li>💬 WhatsApp: +63 123 456 7890</li>
        </ul>

        <p><strong>Request Date:</strong> {{ $subscriptionRequest->created_at->format('F j, Y g:i A') }}</p>
        <p><strong>Reference ID:</strong> {{ strtoupper($subscriptionRequest->request_type) }}-{{ $subscriptionRequest->id }}-{{ now()->format('Ymd') }}</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>Thank you for choosing Smile Suite!</p>
    </div>
</body>
</html>
