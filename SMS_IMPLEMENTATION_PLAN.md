# 📱 SMS Implementation Plan for Smile Suite

## Executive Summary

This document outlines the implementation of SMS functionality using Semaphore API for Smile Suite's appointment system. The implementation includes SMS notifications for appointment confirmations and daily reminder system.

---

## 🎯 Requirements Analysis

### Current System State

-   ✅ **Email notifications** are fully functional for appointment approvals
-   ✅ **Phone numbers** stored in `patients.phone_number` field
-   ✅ **Appointment approval flow** exists in `AppointmentController@approveOnlineRequest`
-   ✅ **Reminder infrastructure** exists but only sends in-app notifications to staff
-   ✅ **Appointment model** has all necessary data (patient, clinic, scheduled_at, etc.)

### Missing Components

-   ❌ SMS service integration
-   ❌ SMS sending capability
-   ❌ Patient-facing appointment reminders (currently only staff notifications)
-   ❌ Daily reminder scheduling for patients

---

## 📋 Implementation Plan

### Phase 1: Core SMS Service Infrastructure

#### 1.1 Create SemaphoreSmsService

**File:** `app/Services/SemaphoreSmsService.php`

-   Handle Semaphore API communication
-   Send single SMS messages
-   Send bulk SMS messages
-   Track SMS delivery status
-   Retry failed messages
-   Validate phone numbers (Philippine format)
-   Credit-safe testing mode

**Key Methods:**

```php
public function send($phone, $message)
public function sendBulk(array $messages)
public function validatePhoneNumber($phone)
public function isTestMode()
public function getCreditUsage()
```

#### 1.2 Environment Configuration

**File:** `.env`

```env
SEMAPHORE_API_KEY=6dff29a20c4ad21b0ff30725e15c23d0
SEMAPHORE_SENDER_NAME=AutoRepair
SEMAPHORE_TEST_MODE=true
```

#### 1.3 Service Provider Registration

**File:** `app/Providers/AppServiceProvider.php`

-   Register SMS service as singleton
-   Configure test mode behavior

---

### Phase 2: Appointment Approval SMS

#### 2.1 Update AppointmentController

**File:** `app/Http/Controllers/Clinic/AppointmentController.php`
**Method:** `approveOnlineRequest()`

**Changes:**

```php
// After email is sent (line 451-456), add:
try {
    $smsService = app(SemaphoreSmsService::class);
    $smsService->sendAppointmentConfirmation($appointment, $patient);
    Log::info('SMS sent to: ' . $patient->phone_number);
} catch (\Exception $e) {
    Log::error('Failed to send SMS: ' . $e->getMessage());
    // Don't fail the approval if SMS fails
}
```

#### 2.2 SMS Message Template

**Content:** Similar to email but SMS-optimized (160 chars)

```
Hi {name}! Your appointment at {clinic} is confirmed for {date} at {time} with {dentist}. See you there! - Smile Suite
```

---

### Phase 3: Daily Appointment Reminders

#### 3.1 Create Reminder Command

**File:** `app/Console/Commands/SendAppointmentRemindersDaily.php`

**Logic:**

-   Run daily at 8:00 AM (Asia/Manila timezone)
-   Query appointments scheduled for TODAY
-   Filter by status: 'Pending', 'Confirmed'
-   Send SMS + Email to patients
-   Log all attempts

#### 3.2 Update SendUpcomingAppointmentReminders Job

**File:** `app/Jobs/SendUpcomingAppointmentReminders.php`

**Changes:**

-   Add SMS sending functionality
-   Send SMS to patients (not just staff notifications)
-   Include link to patient portal

#### 3.3 SMS Reminder Template

**Content:**

```
Hi {name}! Reminder: You have an appointment TODAY at {time} with {dentist} at {clinic}. See you soon! - Smile Suite
```

#### 3.4 Schedule the Command

**File:** `routes/console.php`

```php
// Run daily at 8:00 AM Manila time
Schedule::command('appointments:send-daily-reminders')
    ->dailyAt('08:00')
    ->timezone('Asia/Manila');
```

---

### Phase 4: Testing & Safety

#### 4.1 Test Mode Implementation

-   When `SEMAPHORE_TEST_MODE=true`, don't send actual SMS
-   Log SMS content instead
-   Return success response for testing
-   Only send real SMS when explicitly enabled

#### 4.2 Phone Validation

-   Philippine format: +639xxxxxxxxx or 09xxxxxxxxx
-   International format: +63XXXXXXXXXX
-   Strip spaces, dashes, parentheses
-   Validate length and format

#### 4.3 Error Handling

-   Catch API failures gracefully
-   Don't block appointment approval if SMS fails
-   Log all SMS attempts and failures
-   Track delivery status

#### 4.4 Credit Protection

-   Test mode by default
-   Opt-in for production SMS
-   Monitor credit usage
-   Rate limiting on bulk sends

---

## 🔧 Technical Details

### Semaphore API Integration

-   **API Endpoint:** https://semaphore.co/api/v4/messages
-   **Method:** POST
-   **Authentication:** API Key in header
-   **Rate Limit:** Check documentation
-   **Features:** Delivery reports, bulk messaging

### Phone Number Format

Philippine numbers must be formatted as:

-   International: `+639123456789`
-   Local: `09123456789`
    Remove all formatting (spaces, dashes, etc.)

### SMS Length Guidelines

-   Standard SMS: 160 characters
-   Long SMS (2+ parts): 153 characters per part
-   Keep messages concise but informative

---

## 📝 Files to Create/Modify

### New Files

1. `app/Services/SemaphoreSmsService.php` - SMS service
2. `app/Console/Commands/SendAppointmentRemindersDaily.php` - Daily reminder command
3. `SMS_TESTING_GUIDE.md` - Testing documentation

### Modified Files

1. `app/Http/Controllers/Clinic/AppointmentController.php` - Add SMS on approval
2. `app/Jobs/SendUpcomingAppointmentReminders.php` - Add SMS reminders
3. `app/Providers/AppServiceProvider.php` - Register SMS service
4. `routes/console.php` - Schedule daily reminders
5. `.env` - Add Semaphore credentials

### Template Files

1. SMS templates for confirmation
2. SMS templates for reminders

---

## 🧪 Testing Strategy

### Phase 1: Test Mode (No Credits Used)

1. Enable `SEMAPHORE_TEST_MODE=true`
2. Approve test appointments
3. Check logs for SMS content
4. Verify no actual SMS sent

### Phase 2: Single SMS Test

1. Set `SEMAPHORE_TEST_MODE=false`
2. Use test phone number
3. Send single appointment confirmation
4. Verify delivery

### Phase 3: Reminder Test

1. Create test appointment for today
2. Run reminder command manually
3. Verify SMS + Email both sent

### Phase 4: Production Deployment

1. Monitor first few days carefully
2. Watch credit usage
3. Verify delivery rates
4. Check logs for errors

---

## ⚠️ Important Considerations

### Credit Management

-   **Shared subscription** - be careful with credits
-   **Test mode by default** prevents accidental SMS
-   **Monitor usage** closely in early days
-   **Graceful degradation** - SMS failure shouldn't break approvals

### Privacy & Compliance

-   Only send to verified phone numbers
-   Respect opt-out requests
-   Include clinic contact info in messages
-   Comply with SMS regulations

### Fallback Strategy

-   If SMS fails, email still goes through
-   Log all attempts for debugging
-   Retry failed SMS (configurable)
-   Admin dashboard for SMS status

---

## 📊 Success Metrics

After implementation, we should track:

-   ✅ SMS sent successfully
-   ✅ SMS failed (with reasons)
-   ✅ Credit usage per month
-   ✅ Delivery success rate
-   ✅ Patient response to reminders

---

## 🚀 Deployment Checklist

-   [ ] Create SemaphoreSmsService
-   [ ] Add environment variables
-   [ ] Update AppointmentController
-   [ ] Create daily reminder command
-   [ ] Update SendUpcomingAppointmentReminders job
-   [ ] Schedule command in console.php
-   [ ] Test in test mode
-   [ ] Test with single SMS
-   [ ] Deploy to production
-   [ ] Monitor initial usage
-   [ ] Enable production mode

---

## 📞 Support & Documentation

-   Semaphore API: https://docs.semaphore.co
-   Rate Limits: Check documentation
-   Error Codes: Reference API docs
-   Support: Email Semaphore support if needed

---

**Implementation Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Risk Level:** LOW (with proper testing)  
**Credit Safety:** GUARANTEED (test mode by default)
