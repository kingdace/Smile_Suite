# 📧 Email Setup Guide for Smile Suite

## 🎯 **Your Perfect Flow is Implemented!**

✅ **Clinic submits registration** → Admin receives notification  
✅ **Admin approves** → Email sent with payment instructions  
✅ **Clinic pays** → Payment confirmation email sent  
✅ **Clinic completes setup** → Final registration with credentials

## 🚀 **Email Configuration Options**

### **Option 1: Gmail SMTP (FREE - Recommended for Testing)**

#### **Step 1: Enable Gmail App Passwords**

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password instead of your regular Gmail password

#### **Step 2: Update .env File**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Smile Suite"
```

#### **Step 3: Test Email**

```bash
php artisan tinker
Mail::raw('Test email from Smile Suite', function($message) {
    $message->to('test@example.com')->subject('Test Email');
});
```

### **Option 2: Mailtrap (FREE for Development)**

#### **Step 1: Sign up at Mailtrap.io**

-   Free account: 100 emails/month
-   Perfect for development and testing

#### **Step 2: Update .env File**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@smilesuite.com
MAIL_FROM_NAME="Smile Suite"
```

### **Option 3: SendGrid (FREE Tier - Production Ready)**

#### **Step 1: Sign up at SendGrid.com**

-   Free tier: 100 emails/day
-   Excellent deliverability
-   Production-ready

#### **Step 2: Update .env File**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@smilesuite.com
MAIL_FROM_NAME="Smile Suite"
```

## 🔧 **Quick Setup for Testing (Gmail)**

### **1. Update your .env file:**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-gmail@gmail.com
MAIL_FROM_NAME="Smile Suite"
```

### **2. Clear config cache:**

```bash
php artisan config:clear
```

### **3. Test the email system:**

```bash
php artisan tinker
Mail::raw('Test email from Smile Suite', function($message) {
    $message->to('your-test-email@example.com')->subject('Test Email');
});
```

## 📋 **Complete Flow Testing**

### **Step 1: Submit Clinic Registration**

1. Visit: `http://127.0.0.1:8000/register/clinic`
2. Fill out the form and submit
3. Check admin dashboard for new request

### **Step 2: Admin Approval**

1. Login as admin
2. Go to: `http://127.0.0.1:8000/admin/clinic-requests`
3. View the request and click "Approve"
4. **Email sent automatically** with payment instructions

### **Step 3: Payment Confirmation**

1. In admin panel, update payment status to "paid"
2. **Email sent automatically** with setup link
3. Check Laravel logs for setup URL

### **Step 4: Clinic Setup**

1. Click the setup link from the email
2. Complete clinic setup form
3. Create admin account and login

## 🎨 **Email Templates Created**

✅ **ClinicRegistrationApproved** - Sent when admin approves request  
✅ **PaymentConfirmed** - Sent when payment is confirmed  
✅ **Professional HTML templates** with branding  
✅ **Mobile-responsive design**  
✅ **Clear call-to-action buttons**

## 💡 **Production Recommendations**

### **For Production Use:**

1. **SendGrid** - Best for high volume, excellent deliverability
2. **Amazon SES** - Cost-effective for large volumes
3. **Mailgun** - Developer-friendly, good deliverability

### **Email Best Practices:**

-   Use a professional domain email (noreply@smilesuite.com)
-   Set up SPF and DKIM records
-   Monitor email deliverability
-   Use email templates for consistency

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Gmail blocks login** - Use App Password, not regular password
2. **Emails not sending** - Check MAIL_MAILER setting
3. **Emails in spam** - Set up proper DNS records
4. **Port issues** - Use port 587 for TLS, 465 for SSL

### **Debug Email:**

```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Test email in tinker
php artisan tinker
Mail::raw('Test', function($msg) { $msg->to('test@example.com'); });
```

## 🎉 **Your System is Ready!**

The clinic registration flow with email functionality is now complete and ready for testing. Choose your email provider, update the .env file, and start testing the complete flow!
