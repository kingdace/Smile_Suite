<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Request Rejected</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .alert-box {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #721c24;
        }
        .footer {
            text-align: center;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
            color: #6c757d;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .details {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🦷 Smile Suite</div>
            <p>Subscription Request Rejected</p>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $subscriptionRequest->clinic->name }}</strong>,</p>

            <div class="alert-box">
                <strong>⚠️ Important Notice:</strong> Your subscription request has been rejected.
            </div>

            <p>We regret to inform you that your subscription request has been rejected by our administration team.</p>

            <div class="details">
                <h4>Request Details:</h4>
                <p><strong>Request Type:</strong> {{ ucfirst($subscriptionRequest->request_type) }}</p>
                <p><strong>Current Plan:</strong> {{ ucfirst($subscriptionRequest->current_plan) }}</p>
                @if($subscriptionRequest->requested_plan)
                    <p><strong>Requested Plan:</strong> {{ ucfirst($subscriptionRequest->requested_plan) }}</p>
                @endif
                <p><strong>Duration:</strong> {{ $subscriptionRequest->duration_months }} month(s)</p>
                <p><strong>Request Date:</strong> {{ $subscriptionRequest->created_at->format('F j, Y g:i A') }}</p>
            </div>

            @if($subscriptionRequest->admin_notes)
                <div class="details">
                    <h4>Admin Notes:</h4>
                    <p>{{ $subscriptionRequest->admin_notes }}</p>
                </div>
            @endif

            <p>If you have any questions about this decision or would like to discuss alternative options, please don't hesitate to contact our support team.</p>

            <p>You can also submit a new request with different parameters if needed.</p>
        </div>

        <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>📧 Email: support@smilesuite.com</p>
            <p>📞 Phone: +63 123 456 7890</p>
            <p>💬 WhatsApp: +63 123 456 7890</p>
            <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

