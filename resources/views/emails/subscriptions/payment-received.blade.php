<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Subscription Payment Received</title>
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
            background: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .details {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .button {
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 Payment Received</h1>
        <p>Subscription payment has been submitted</p>
    </div>

    <div class="content">
        <h2>Hello Admin,</h2>

        <p>A subscription payment has been received and requires your verification.</p>

        <div class="details">
            <h3>Payment Details:</h3>
            <ul>
                <li><strong>Clinic:</strong> {{ $subscriptionRequest->clinic->name }}</li>
                <li><strong>Request Type:</strong> {{ ucfirst($subscriptionRequest->request_type) }}</li>
                <li><strong>Plan:</strong> {{ ucfirst($subscriptionRequest->request_type === 'upgrade' ? $subscriptionRequest->requested_plan : $subscriptionRequest->current_plan) }}</li>
                <li><strong>Duration:</strong> {{ $subscriptionRequest->duration_months }} month(s)</li>
                <li><strong>Amount:</strong> ₱{{ number_format($subscriptionRequest->calculated_amount, 2) }}</li>
                <li><strong>Payment Method:</strong> {{ $subscriptionRequest->payment_details['payment_method'] ?? 'Not specified' }}</li>
                <li><strong>Submitted:</strong> {{ $subscriptionRequest->processed_at->format('M d, Y g:i A') }}</li>
            </ul>
        </div>

        @if(isset($subscriptionRequest->payment_details))
        <div class="details">
            <h3>Payment Information:</h3>
            <ul>
                <li><strong>Sender Name:</strong> {{ $subscriptionRequest->payment_details['sender_name'] ?? 'Not provided' }}</li>
                <li><strong>Sender Number:</strong> {{ $subscriptionRequest->payment_details['sender_number'] ?? 'Not provided' }}</li>
                @if(isset($subscriptionRequest->payment_details['reference_number']))
                    <li><strong>Reference Number:</strong> {{ $subscriptionRequest->payment_details['reference_number'] }}</li>
                @endif
                @if(isset($subscriptionRequest->payment_details['amount_sent']))
                    <li><strong>Amount Sent:</strong> ₱{{ number_format($subscriptionRequest->payment_details['amount_sent'], 2) }}</li>
                @endif
            </ul>
        </div>
        @endif

        <p><strong>Next Steps:</strong></p>
        <ol>
            <li>Verify the payment details above</li>
            <li>Check if the payment matches the expected amount</li>
            <li>Verify the payment method and reference details</li>
            <li>Complete the subscription request if payment is valid</li>
        </ol>

        <a href="{{ route('admin.subscription-requests.index') }}" class="button">
            Review Subscription Requests
        </a>

        <p><strong>Note:</strong> Please verify the payment before completing the subscription request. If the payment is invalid, you can reject the request.</p>
    </div>

    <div class="footer">
        <p>This is an automated notification from Smile Suite.</p>
        <p>If you have any questions, please contact the development team.</p>
    </div>
</body>
</html>

