<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Subscription Upgrade Request</title>
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
        <p>Subscription Upgrade Request</p>
    </div>

    <div class="content">
        <h2>New Upgrade Request</h2>

        <div class="info-box">
            <h3>Clinic Information</h3>
            <p><strong>Clinic Name:</strong> {{ $clinic->name }}</p>
            <p><strong>Email:</strong> {{ $clinic->email }}</p>
            <p><strong>Current Plan:</strong> {{ ucfirst($clinic->subscription_plan) }}</p>
            <p><strong>Current Status:</strong> {{ ucfirst($clinic->subscription_status) }}</p>
        </div>

        <div class="info-box">
            <h3>Upgrade Request Details</h3>
            <p><strong>Requested Plan:</strong> {{ ucfirst($upgradeData['new_plan']) }}</p>
            <p><strong>Duration:</strong> {{ $upgradeData['duration_months'] }} month(s)</p>
            @if(isset($upgradeData['message']) && $upgradeData['message'])
                <p><strong>Message:</strong> {{ $upgradeData['message'] }}</p>
            @endif
        </div>

        <h3>Next Steps:</h3>
        <ol>
            <li>Review the upgrade request</li>
            <li>Calculate the upgrade cost</li>
            <li>Send payment instructions to the clinic</li>
            <li>Process payment and update subscription</li>
        </ol>

        <div style="text-align: center;">
            <a href="{{ route('admin.subscriptions.index') }}" class="button">Manage Subscriptions</a>
        </div>

        <p><strong>Request Date:</strong> {{ now()->format('F j, Y g:i A') }}</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Smile Suite. All rights reserved.</p>
        <p>This is an automated notification from Smile Suite.</p>
    </div>
</body>
</html>

