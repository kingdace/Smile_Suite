<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Rejected</title>
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
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .status-badge {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
        }
        .details {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #495057;
        }
        .value {
            color: #6c757d;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Smile Suite</div>
            <h1>Payment Rejected</h1>
            <div class="status-badge">Payment Not Accepted</div>
        </div>

        <p>Dear <strong>{{ $subscriptionRequest->clinic->name }}</strong>,</p>

        <p>We regret to inform you that your payment for subscription request <strong>#{{ $subscriptionRequest->id }}</strong> has been rejected by our admin team.</p>

        <div class="details">
            <h3>Request Details</h3>
            <div class="detail-row">
                <span class="label">Request Type:</span>
                <span class="value">{{ ucfirst($subscriptionRequest->request_type) }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Current Plan:</span>
                <span class="value">{{ ucfirst($subscriptionRequest->current_plan) }}</span>
            </div>
            @if($subscriptionRequest->requested_plan)
            <div class="detail-row">
                <span class="label">Requested Plan:</span>
                <span class="value">{{ ucfirst($subscriptionRequest->requested_plan) }}</span>
            </div>
            @endif
            <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ $subscriptionRequest->duration_months }} month(s)</span>
            </div>
            <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">₱{{ number_format($subscriptionRequest->calculated_amount, 2) }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Reference Number:</span>
                <span class="value">{{ $subscriptionRequest->reference_number ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">{{ ucfirst(str_replace('_', ' ', $subscriptionRequest->payment_method ?? 'N/A')) }}</span>
            </div>
        </div>

        <p><strong>Reason for Rejection:</strong></p>
        <p>{{ $subscriptionRequest->payment_verification_notes ?? 'No specific reason provided.' }}</p>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Please review the payment details and ensure all information is correct</li>
            <li>If you believe this is an error, please contact our support team</li>
            <li>You may submit a new payment with corrected information</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ route('clinic.subscription.index') }}" class="button">View Subscription Details</a>
        </div>

        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

        <div class="footer">
            <p>Thank you for choosing Smile Suite</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

