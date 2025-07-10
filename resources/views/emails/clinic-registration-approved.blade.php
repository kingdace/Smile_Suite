<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Clinic Registration Approved</title>
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
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background: #218838;
        }
        .details {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
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
        <h1>🎉 Clinic Registration Approved!</h1>
        <p>Welcome to Smile Suite</p>
    </div>

    <div class="content">
        <h2>Dear {{ $request->contact_person }},</h2>

        <p>Great news! Your clinic registration request for <strong>{{ $request->clinic_name }}</strong> has been approved by our team.</p>

        <div class="details">
            <h3>Registration Details:</h3>
            <ul>
                <li><strong>Clinic Name:</strong> {{ $request->clinic_name }}</li>
                <li><strong>Contact Person:</strong> {{ $request->contact_person }}</li>
                <li><strong>Email:</strong> {{ $request->email }}</li>
                <li><strong>Subscription Plan:</strong> {{ ucfirst($request->subscription_plan) }}</li>
                <li><strong>Monthly Cost:</strong> ₱{{ number_format($request->subscription_amount, 2) }}</li>
            </ul>
        </div>

        <h3>Next Steps:</h3>
        <ol>
            <li><strong>Complete Payment:</strong> Please complete your subscription payment to proceed with the setup.</li>
            <li><strong>Payment Methods:</strong> We accept bank transfers, GCash, and credit cards.</li>
            <li><strong>Setup Access:</strong> Once payment is confirmed, you'll receive setup instructions.</li>
        </ol>

        <h3>Payment Instructions:</h3>
        <div class="details">
            <p><strong>Bank Transfer:</strong></p>
            <ul>
                <li>Bank: BDO</li>
                <li>Account Name: Smile Suite Inc.</li>
                <li>Account Number: 1234-5678-9012</li>
                <li>Reference: {{ $request->id }}</li>
            </ul>

            <p><strong>GCash:</strong></p>
            <ul>
                <li>Number: 0917-123-4567</li>
                <li>Name: Smile Suite</li>
                <li>Reference: {{ $request->id }}</li>
            </ul>
        </div>

        <p><strong>Important:</strong> Please include your reference number <strong>{{ $request->id }}</strong> in your payment to ensure proper processing.</p>

        <p>Once you've completed the payment, please reply to this email with your payment confirmation, or our team will contact you within 24 hours to confirm receipt.</p>

        <p>If you have any questions about the payment process, please don't hesitate to contact us at <a href="mailto:support@smilesuite.com">support@smilesuite.com</a>.</p>

        <p>We're excited to have you join the Smile Suite family!</p>

        <p>Best regards,<br>
        <strong>The Smile Suite Team</strong></p>
    </div>

    <div class="footer">
        <p>This email was sent to {{ $request->email }}<br>
        Smile Suite - Dental Practice Management System<br>
        © {{ date('Y') }} Smile Suite. All rights reserved.</p>
    </div>
</body>
</html>
