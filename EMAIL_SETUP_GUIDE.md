# Email Setup Guide - Smile Suite

## Problem: Gmail SMTP Issues on Railway/cPanel

Gmail SMTP often fails in production environments due to:
- IP reputation issues
- Rate limiting
- SSL certificate verification problems
- Network firewall restrictions

## ✅ Solution: Use Resend (Recommended)

**Resend** is a modern transactional email service that's:
- ✅ **Free**: 3,000 emails/month (100/day)
- ✅ **Reliable**: Better deliverability than Gmail
- ✅ **Fast**: No SMTP connection delays
- ✅ **Easy**: 5-minute setup

---

## 📋 Setup Instructions

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click **"Sign Up"** (free, no credit card required)
3. Verify your email

### Step 2: Get Your API Key

1. In Resend dashboard, go to **"API Keys"**
2. Click **"Create API Key"**
3. Name it: `Smile Suite Production`
4. Click **"Create"**
5. **Copy the API key** (starts with `re_...`)

### Step 3: Verify Your Domain (Optional but Recommended)

1. In Resend, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `smilesuite.site`
4. Add the DNS records shown to your domain (in Cloudflare or your DNS provider)
5. Wait for verification (usually 5-15 minutes)

**OR** use Resend's default domain (works immediately but less professional):
- From: `noreply@resend.dev`
- To: Any email address

### Step 4: Configure Railway

1. Go to **Railway Dashboard** → Your Project → **Smile Suite** service
2. Go to **Variables** tab
3. **Add/Update these variables**:

```env
MAIL_MAILER=resend
RESEND_API_KEY=re_your_api_key_here
MAIL_FROM_ADDRESS=noreply@smilesuite.site
MAIL_FROM_NAME=Smile Suite
```

4. Click **"Deploy"** to redeploy with new settings

### Step 5: Test on Production

1. Go to `https://smilesuite.site/register`
2. Try registering a new patient account
3. Check your email for verification code
4. ✅ It should arrive within seconds!

---

## 🔧 Configuration Options

### For Production (Railway):
```env
MAIL_MAILER=resend
RESEND_API_KEY=re_your_actual_key
MAIL_FROM_ADDRESS=noreply@smilesuite.site
MAIL_FROM_NAME=Smile Suite
```

### For Local Development:
Keep using Gmail SMTP (it works fine locally):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your.email@gmail.com
MAIL_FROM_NAME=Smile Suite
```

---

## 🆘 Troubleshooting

### "Domain not verified" Error
**Solution**: Use Resend's default sending domain initially:
```env
MAIL_FROM_ADDRESS=noreply@resend.dev
```
Then verify your custom domain later.

### Emails Going to Spam
**Solution**: 
1. Verify your domain in Resend (adds SPF/DKIM records)
2. Warm up your sending reputation (start with low volume)
3. Use a professional "from" address (not noreply@)

### "API Key Invalid" Error
**Solution**: 
1. Make sure API key starts with `re_`
2. Check for spaces before/after the key
3. Regenerate the API key in Resend if needed

---

## 📊 Monitoring

**Check email delivery in Resend:**
1. Go to Resend Dashboard → **"Logs"**
2. See all sent emails, delivery status, and errors
3. Much better than Gmail's lack of visibility!

---

## 🔄 Fallback: If You Can't Use Resend

If Resend doesn't work for you, alternative options:

### Option 1: Mailtrap (For Testing)
- Free tier: 1,000 emails/month
- https://mailtrap.io

### Option 2: SendGrid
- Free tier: 100 emails/day
- https://sendgrid.com

### Option 3: Mailgun
- Free tier: 1,000 emails/month (first 3 months)
- https://mailgun.com

All work similarly to Resend with Laravel.

---

## ✨ Benefits of Resend Over Gmail

| Feature | Gmail SMTP | Resend |
|---------|-----------|---------|
| **Reliability in Production** | ❌ Often blocked | ✅ Always works |
| **Deliverability** | ⚠️ Often goes to spam | ✅ High deliverability |
| **Speed** | ⚠️ Slow SMTP connection | ✅ Instant API |
| **Monitoring** | ❌ No visibility | ✅ Full logs & analytics |
| **Cost** | ✅ Free | ✅ Free (3K/month) |
| **Setup Difficulty** | ⚠️ App passwords, 2FA | ✅ Just API key |

---

## 📝 Summary

1. **Sign up** at https://resend.com (free)
2. **Get API key** from Resend dashboard
3. **Add to Railway**:
   ```
   MAIL_MAILER=resend
   RESEND_API_KEY=re_your_key
   ```
4. **Redeploy** and test!

That's it! Your emails will now be reliable and fast! 🚀

