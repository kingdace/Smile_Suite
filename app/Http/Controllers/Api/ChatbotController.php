<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private $dentalKnowledge = [
        // === CORE PLATFORM FEATURES ===
        'platform_overview' => [
            'keywords' => ['smile suite', 'platform', 'system', 'features', 'what is', 'how does', 'overview'],
            'response' => "Smile Suite is a comprehensive cloud-based dental clinic management platform! 🦷✨ It's designed specifically for dental clinics in the Philippines and offers:\n\n• **Multi-tenant SaaS architecture** - Each clinic has their own secure space\n• **Complete patient management** - Records, medical history, appointments\n• **Advanced appointment scheduling** - Online booking, calendar management, waitlists\n• **Inventory management** - Stock tracking, suppliers, purchase orders\n• **Treatment planning** - Comprehensive treatment records and tracking\n• **Payment processing** - Multiple payment methods and insurance support\n• **Reporting & analytics** - Detailed insights and business intelligence\n• **Public clinic directory** - Patients can discover and book with clinics\n• **Subscription management** - Trial periods, billing, and access control\n\nIt's built with Laravel 11, React 18, and Inertia.js for a modern, responsive experience!"
        ],

        // === APPOINTMENT MANAGEMENT ===
        'appointment_booking' => [
            'keywords' => ['appointment', 'book', 'schedule', 'visit', 'consultation', 'booking', 'online booking'],
            'response' => "Great question! Booking an appointment with Smile Suite is really simple! 😊\n\nHere's how it works:\n\n**For You (Patients):**\n• First, browse our clinic directory to find a clinic near you\n• Check out their profile - you'll see their services, dentist info, and patient reviews\n• Click 'Book Appointment' and choose your preferred time\n• You'll get an email confirmation right away!\n• You can manage all your appointments in your patient portal\n\n**What's Cool About Our System:**\n• Real-time availability - see exactly when dentists are free\n• Smart scheduling - no double bookings or conflicts\n• Email reminders so you never miss an appointment\n• Easy rescheduling if your plans change\n\n**Types of Appointments:**\n• Regular checkups and cleanings\n• Emergency visits\n• Follow-up appointments\n• Specialist consultations\n\nReady to book? Just find a clinic you like and click that 'Book Appointment' button! 🦷✨"
        ],

        'appointment_management' => [
            'keywords' => ['manage appointments', 'calendar', 'schedule', 'reschedule', 'cancel', 'conflicts'],
            'response' => "Smile Suite offers powerful appointment management tools! 🗓️\n\n**Calendar Features:**\n• Full calendar view with monthly, weekly, daily views\n• Color-coded by appointment type and status\n• Drag-and-drop rescheduling\n• Bulk operations for multiple appointments\n• Export to Excel/CSV\n\n**Smart Scheduling:**\n• Automatic conflict detection\n• Dentist availability checking\n• Business hours validation\n• Holiday management\n• Recurring appointment patterns\n\n**Waitlist System:**\n• Add patients to waitlist when slots are full\n• Priority-based queuing\n• Automatic notifications when slots open\n• Convert waitlist entries to appointments\n\n**Approval Workflow:**\n• Online booking requests require approval\n• Reschedule requests with approval/denial\n• Email notifications for all parties\n• Reason tracking for cancellations"
        ],

        // === PATIENT MANAGEMENT ===
        'patient_management' => [
            'keywords' => ['patient', 'records', 'medical history', 'patient data', 'demographics'],
            'response' => "Patient management is comprehensive and secure! 👥\n\n**Patient Records Include:**\n• Personal information (name, contact, demographics)\n• Medical history and allergies\n• Insurance information\n• Emergency contacts\n• Address with Philippine PSGC integration\n• Blood type and medical conditions\n• Treatment history and notes\n\n**Patient Categories:**\n• Regular, VIP, Emergency, Pediatric, Senior\n• New vs Returning patients\n• Status tracking (Active, Inactive, New)\n\n**Patient Portal Features:**\n• View treatment history across all clinics\n• Book and manage appointments\n• Access treatment records\n• Update personal information\n• Claim existing records from different clinics\n\n**Data Security:**\n• Complete clinic isolation\n• Role-based access control\n• Audit trails for all changes\n• Soft delete with restore capability\n• Email verification system"
        ],

        'patient_registration' => [
            'keywords' => ['register', 'sign up', 'create account', 'patient registration', 'new patient'],
            'response' => "Patient registration is simple and secure! 📝\n\n**Registration Process:**\n1. **Public Registration** - Sign up on the main website\n2. **Email Verification** - Verify your email with a code\n3. **Record Claiming** - Link to existing clinic records if any\n4. **Account Activation** - Full access to patient portal\n\n**Features:**\n• Automatic record linking across clinics\n• Email verification system\n• Record claiming for existing patients\n• Secure password requirements\n• Profile management\n\n**For Existing Patients:**\n• If you've been to a clinic before, we'll help you claim your records\n• Automatic linking to your user account\n• Access to complete treatment history\n• Seamless experience across all clinics\n\n**Data Integration:**\n• Philippine PSGC for accurate addresses\n• Integration with clinic systems\n• Automatic patient creation when booking appointments"
        ],

        // === CLINIC MANAGEMENT ===
        'clinic_management' => [
            'keywords' => ['clinic', 'clinic management', 'clinic admin', 'clinic features', 'clinic setup'],
            'response' => "Clinic management is powerful and comprehensive! 🏥\n\n**Clinic Registration Process:**\n1. **Registration Request** - Submit clinic information\n2. **Admin Review** - System admin reviews and approves\n3. **Payment Processing** - Secure payment for subscription\n4. **Clinic Setup** - Configure clinic details and staff\n5. **Go Live** - Start using the platform\n\n**Clinic Features:**\n• **Dashboard** - Real-time metrics and analytics\n• **Staff Management** - Add dentists, staff, and admins\n• **Service Catalog** - Manage services and pricing\n• **Inventory Control** - Stock management and suppliers\n• **Financial Tracking** - Payments and revenue reports\n• **Patient Portal** - Complete patient management\n• **Appointment System** - Advanced scheduling tools\n• **Treatment Planning** - Comprehensive treatment records\n\n**Multi-Role System:**\n• **Clinic Admin** - Full clinic control\n• **Dentist** - Patient care and scheduling\n• **Staff** - Limited operational access\n• **System Admin** - Platform management\n\n**Subscription Management:**\n• 14-day free trial\n• Flexible billing cycles\n• Grace period handling\n• Automated monitoring"
        ],

        'clinic_directory' => [
            'keywords' => ['clinic directory', 'find clinic', 'search clinic', 'clinic list', 'nearby clinic'],
            'response' => "Perfect! I can help you find the best dental clinic for your needs! 🔍\n\nHere's how our clinic directory works:\n\n**Easy Search Options:**\n• Search by location - find clinics near you\n• Filter by services - looking for braces? We'll show you orthodontists!\n• Check ratings - see what other patients say\n• Find available slots - see which clinics have open appointments\n\n**What You'll See on Each Clinic Profile:**\n• All their contact info and address\n• Complete list of services they offer\n• Meet their dentists and see their specialties\n• Browse photos of the clinic\n• Read real patient reviews and ratings\n• Check their operating hours\n• Get directions with our built-in map\n\n**The Best Part:**\n• Book appointments directly from the clinic profile!\n• See real-time availability\n• Get instant confirmation\n• No need to call around!\n\nReady to find your perfect dental clinic? Just browse our directory and I'll help you pick the right one! 😊"
        ],

        // === SERVICES & TREATMENTS ===
        'dental_services' => [
            'keywords' => ['services', 'treatments', 'procedures', 'dental care', 'what services'],
            'response' => "Awesome question! Our clinics offer a comprehensive range of dental services to keep your smile healthy and beautiful! 😊\n\n**Here's what you can find:**\n\n**🦷 General Dentistry**\n• Regular checkups and cleanings\n• Fillings and cavity treatments\n• Root canals and extractions\n\n**✨ Cosmetic Dentistry**\n• Teeth whitening\n• Veneers and bonding\n• Smile makeovers\n\n**🦷 Orthodontics**\n• Traditional braces\n• Invisalign clear aligners\n• Retainers\n\n**🏥 Specialized Care**\n• Oral surgery (wisdom teeth, implants)\n• Pediatric dentistry (kids' dental care)\n• Emergency dental services\n• Gum treatment and surgery\n• Dentures and prosthetics\n\n**What's Great About Our System:**\n• Each clinic shows exactly what services they offer\n• You can see pricing and time estimates\n• Book appointments for specific treatments\n• Get preparation and aftercare instructions\n\nLooking for something specific? Just let me know what dental care you need, and I'll help you find the perfect clinic! 🦷✨"
        ],

        'treatment_planning' => [
            'keywords' => ['treatment', 'treatment plan', 'procedure', 'treatment history', 'care plan'],
            'response' => "Treatment planning is comprehensive and detailed! 📋\n\n**Treatment Features:**\n• **Complete Treatment Records** - Detailed procedure documentation\n• **Multi-Visit Planning** - Complex treatment sequences\n• **Progress Tracking** - Monitor treatment completion\n• **Inventory Integration** - Track materials used\n• **Cost Calculation** - Automatic pricing\n• **Dentist Assignment** - Link treatments to providers\n\n**Treatment Types:**\n• **Single Procedures** - One-time treatments\n• **Multi-Visit Plans** - Complex treatment sequences\n• **Follow-up Care** - Maintenance and monitoring\n• **Emergency Treatments** - Urgent care procedures\n\n**Documentation:**\n• **Procedure Details** - Step-by-step documentation\n• **Materials Used** - Inventory tracking\n• **Progress Notes** - Treatment updates\n• **Before/After Photos** - Visual documentation\n• **Patient Instructions** - Care guidance\n\n**Integration:**\n• **Appointment Linking** - Connect to scheduled visits\n• **Payment Tracking** - Financial integration\n• **Inventory Management** - Material usage tracking"
        ],

        // === INVENTORY MANAGEMENT ===
        'inventory_management' => [
            'keywords' => ['inventory', 'stock', 'supplies', 'materials', 'inventory tracking'],
            'response' => "Inventory management is powerful and automated! 📦\n\n**Inventory Features:**\n• **Stock Tracking** - Real-time quantity monitoring\n• **Low Stock Alerts** - Automatic notifications\n• **Supplier Management** - Complete supplier database\n• **Purchase Orders** - Automated ordering system\n• **Transaction History** - Complete audit trail\n• **Expiry Tracking** - Monitor expiration dates\n• **Value Calculation** - Automatic cost calculations\n\n**Categories:**\n• **Medications** - Prescription and OTC drugs\n• **Supplies** - Consumable materials\n• **Equipment** - Reusable tools and devices\n• **Others** - Miscellaneous items\n\n**Purchase Order System:**\n• **Create POs** - Generate purchase orders\n• **Approval Workflow** - Multi-level approval\n• **Receiving Process** - Track deliveries\n• **Invoice Matching** - Verify received items\n• **Supplier Performance** - Track supplier metrics\n\n**Integration:**\n• **Treatment Linking** - Connect to procedures\n• **Automatic Deduction** - Reduce stock on use\n• **Cost Tracking** - Monitor material costs\n• **Reporting** - Usage and cost reports"
        ],

        // === PAYMENT & BILLING ===
        'payment_system' => [
            'keywords' => ['payment', 'billing', 'cost', 'price', 'payment methods', 'insurance'],
            'response' => "Great question! We make paying for your dental care super convenient! 💳\n\n**Payment Options We Accept:**\n• **Cash** - Good old-fashioned cash payments\n• **Credit/Debit Cards** - Visa, Mastercard, etc.\n• **GCash** - Super popular e-wallet in the Philippines\n• **PayMaya** - Another great e-wallet option\n• **Bank Transfer** - Direct from your bank account\n• **Insurance** - We work with most insurance providers\n\n**What Makes Our Payment System Awesome:**\n• Pay however you want - we're flexible!\n• Split payments if you need to\n• Set up payment plans for bigger treatments\n• Get professional receipts instantly\n• Easy refunds if needed\n• Track all your payment history\n\n**Insurance Made Easy:**\n• We check your coverage before treatment\n• Handle all the paperwork for you\n• Process claims automatically\n• You only pay your co-payment\n\n**No Hidden Fees:**\n• Transparent pricing - you see everything upfront\n• No surprise charges\n• Clear breakdown of costs\n\nReady to book? Don't worry about payment - we've got you covered! 😊"
        ],

        // === SUBSCRIPTION & BILLING ===
        'subscription_system' => [
            'keywords' => ['subscription', 'billing', 'trial', 'plan', 'upgrade', 'renewal'],
            'response' => "Subscription management is flexible and automated! 💰\n\n**Subscription Plans:**\n• **Trial Period** - 14-day free trial\n• **Monthly Plans** - Flexible monthly billing\n• **Annual Plans** - Discounted yearly options\n• **Custom Plans** - Tailored solutions\n\n**Trial System:**\n• **14-Day Free Trial** - Full access during trial\n• **Trial Extensions** - Admin can extend trials\n• **Trial Monitoring** - Automated status tracking\n• **Trial Notifications** - Email reminders\n\n**Billing Features:**\n• **Automated Billing** - Recurring payments\n• **Grace Periods** - 7-day grace after expiration\n• **Payment Reminders** - Email notifications\n• **Failed Payment Handling** - Retry mechanisms\n• **Manual Override** - Admin controls\n\n**Subscription Management:**\n• **Status Tracking** - Active, trial, expired, cancelled\n• **Usage Monitoring** - Track feature usage\n• **Upgrade/Downgrade** - Change plans easily\n• **Renewal Processing** - Automatic renewals\n• **Cancellation** - Easy cancellation process\n\n**Admin Controls:**\n• **Manual Activation** - Override system\n• **Trial Extensions** - Extend trial periods\n• **Status Override** - Force status changes\n• **Notification Management** - Control email alerts"
        ],

        // === REPORTING & ANALYTICS ===
        'reporting_analytics' => [
            'keywords' => ['reports', 'analytics', 'statistics', 'dashboard', 'metrics', 'data'],
            'response' => "Reporting and analytics provide deep insights! 📊\n\n**Dashboard Metrics:**\n• **Patient Statistics** - New, active, total patients\n• **Appointment Analytics** - Bookings, cancellations, no-shows\n• **Revenue Tracking** - Income, payments, outstanding\n• **Inventory Insights** - Stock levels, usage, costs\n• **Treatment Statistics** - Procedures, completion rates\n• **Staff Performance** - Dentist productivity metrics\n\n**Report Types:**\n• **Patient Reports** - Demographics, treatment history\n• **Appointment Reports** - Scheduling, attendance\n• **Financial Reports** - Revenue, payments, costs\n• **Inventory Reports** - Stock, usage, suppliers\n• **Treatment Reports** - Procedures, outcomes\n• **Staff Reports** - Performance, productivity\n\n**Export Capabilities:**\n• **Excel Export** - Professional spreadsheets\n• **CSV Export** - Data analysis format\n• **PDF Reports** - Printable documents\n• **Custom Filters** - Targeted data extraction\n\n**Real-time Updates:**\n• **Live Dashboard** - Real-time metrics\n• **Automatic Refresh** - Updated data\n• **Chart Visualizations** - Interactive graphs\n• **Trend Analysis** - Historical comparisons"
        ],

        // === TECHNICAL FEATURES ===
        'technical_features' => [
            'keywords' => ['technical', 'features', 'technology', 'security', 'integration', 'api'],
            'response' => "Smile Suite is built with modern, secure technology! 🔧\n\n**Technology Stack:**\n• **Backend** - Laravel 11 (PHP 8.2+)\n• **Frontend** - React 18 + Inertia.js\n• **Database** - MySQL with comprehensive relationships\n• **Styling** - Tailwind CSS + shadcn/ui\n• **Authentication** - Laravel Breeze + Sanctum\n• **Email** - Laravel Mail with professional templates\n\n**Security Features:**\n• **Multi-tenant Architecture** - Complete data isolation\n• **Role-based Access Control** - Granular permissions\n• **Data Encryption** - Secure data storage\n• **Audit Trails** - Complete activity logging\n• **CSRF Protection** - Built-in security\n• **Input Validation** - Comprehensive validation\n\n**Integration Capabilities:**\n• **PSGC API** - Philippine geographic data\n• **Email Services** - SMTP integration\n• **Payment Gateways** - Stripe, GCash, PayMaya\n• **Export Systems** - Excel, CSV, PDF\n• **Notification Systems** - Email, SMS (planned)\n\n**Performance Features:**\n• **Caching** - Redis/File-based caching\n• **Queue System** - Background job processing\n• **Database Optimization** - Efficient queries\n• **CDN Support** - Fast asset delivery"
        ],

        // === USER ROLES & PERMISSIONS ===
        'user_roles' => [
            'keywords' => ['roles', 'permissions', 'access', 'user types', 'admin', 'staff', 'patient'],
            'response' => "Smile Suite has a comprehensive role-based access system! 👥\n\n**User Types:**\n• **System Admin** - Full platform control\n• **Clinic Staff** - Clinic-specific access\n• **Patient** - Personal record access\n\n**Clinic Staff Roles:**\n• **Clinic Admin** - Full clinic management\n• **Dentist** - Patient care and scheduling\n• **Staff** - Limited operational access\n\n**System Admin Permissions:**\n• **Platform Management** - Full system control\n• **Clinic Oversight** - Monitor all clinics\n• **User Management** - Create/manage users\n• **Subscription Control** - Manage billing\n• **System Configuration** - Platform settings\n\n**Clinic Admin Permissions:**\n• **Clinic Management** - Full clinic control\n• **Staff Management** - Add/manage staff\n• **Patient Management** - Complete patient access\n• **Financial Control** - Payment and billing\n• **Reporting** - Clinic-specific reports\n\n**Dentist Permissions:**\n• **Patient Care** - Treatment and records\n• **Appointment Management** - Schedule control\n• **Treatment Planning** - Care planning\n• **Limited Reporting** - Performance metrics\n\n**Staff Permissions:**\n• **Basic Operations** - Limited access\n• **Patient Support** - Basic patient help\n• **Appointment Support** - Scheduling assistance\n• **Inventory Support** - Stock management\n\n**Patient Permissions:**\n• **Personal Records** - Own data only\n• **Appointment Booking** - Schedule visits\n• **Treatment History** - View own treatments\n• **Profile Management** - Update information"
        ],

        // === GEOGRAPHIC INTEGRATION ===
        'geographic_features' => [
            'keywords' => ['location', 'address', 'philippines', 'psgc', 'region', 'province', 'city'],
            'response' => "Smile Suite is fully integrated with Philippine geography! 🇵🇭\n\n**PSGC Integration:**\n• **Complete Address System** - Region, Province, City, Barangay\n• **Automatic Validation** - Ensure accurate addresses\n• **Location Search** - Find clinics by location\n• **Address Conversion** - Codes to readable names\n\n**Geographic Features:**\n• **Region Selection** - 17 regions of the Philippines\n• **Province Filtering** - 81 provinces\n• **City/Municipality** - All cities and municipalities\n• **Barangay Support** - Complete barangay database\n• **Postal Code Integration** - ZIP code support\n\n**Location-based Services:**\n• **Clinic Discovery** - Find nearby clinics\n• **Distance Calculation** - Proximity-based search\n• **Map Integration** - Visual location display\n• **Address Validation** - Ensure accuracy\n\n**Data Accuracy:**\n• **Official PSGC Data** - Government-standard codes\n• **Automatic Updates** - Keep data current\n• **Validation Rules** - Ensure data integrity\n• **Error Prevention** - Catch invalid addresses"
        ],

        // === EMAIL & NOTIFICATIONS ===
        'email_notifications' => [
            'keywords' => ['email', 'notifications', 'alerts', 'reminders', 'communication'],
            'response' => "Email notifications keep everyone informed! 📧\n\n**Patient Notifications:**\n• **Appointment Confirmations** - Booking confirmations\n• **Appointment Reminders** - Pre-visit reminders\n• **Reschedule Notifications** - Schedule changes\n• **Cancellation Alerts** - Appointment cancellations\n• **Treatment Updates** - Care plan changes\n• **Payment Confirmations** - Transaction receipts\n\n**Clinic Notifications:**\n• **New Booking Alerts** - Online appointment requests\n• **Payment Notifications** - Payment received\n• **Inventory Alerts** - Low stock warnings\n• **Subscription Reminders** - Billing notifications\n• **System Updates** - Platform notifications\n\n**Admin Notifications:**\n• **Clinic Registration** - New clinic requests\n• **Subscription Alerts** - Billing issues\n• **System Monitoring** - Platform health\n• **User Management** - Account activities\n\n**Email Features:**\n• **Professional Templates** - Branded email design\n• **Responsive Design** - Mobile-friendly emails\n• **Multi-language Support** - Localized content\n• **Delivery Tracking** - Monitor email success\n• **Template Management** - Customize email content"
        ],

        // === MOBILE & ACCESSIBILITY ===
        'mobile_accessibility' => [
            'keywords' => ['mobile', 'phone', 'tablet', 'responsive', 'accessibility', 'mobile app'],
            'response' => "Smile Suite is fully mobile-responsive and accessible! 📱\n\n**Mobile Features:**\n• **Responsive Design** - Works on all devices\n• **Touch-friendly Interface** - Optimized for touch\n• **Mobile Navigation** - Easy mobile browsing\n• **Fast Loading** - Optimized performance\n• **Offline Capabilities** - Basic offline access\n\n**Accessibility Features:**\n• **Screen Reader Support** - Full accessibility\n• **Keyboard Navigation** - Complete keyboard access\n• **High Contrast** - Visual accessibility\n• **Text Scaling** - Adjustable text size\n• **Voice Commands** - Voice navigation support\n\n**Mobile-specific Features:**\n• **Touch Gestures** - Swipe, pinch, zoom\n• **Mobile Forms** - Optimized input fields\n• **Mobile Calendar** - Touch-friendly scheduling\n• **Mobile Payments** - Easy payment processing\n• **Push Notifications** - Mobile alerts (planned)\n\n**Device Support:**\n• **iOS** - iPhone and iPad support\n• **Android** - All Android devices\n• **Tablets** - iPad and Android tablets\n• **Desktop** - Full desktop experience\n• **Cross-browser** - All modern browsers"
        ],

        // === QUICK ACTION SPECIFIC RESPONSES ===
        'quick_action_book' => [
            'keywords' => ['how do i book an appointment', 'book appointment', 'booking process', 'schedule appointment'],
            'response' => "Booking an appointment is super easy! Here's exactly how to do it: 🦷\n\n**Step-by-Step Process:**\n1. **Browse Clinics** - Go to our clinic directory\n2. **Find Your Clinic** - Search by location or services\n3. **View Clinic Profile** - Check services, dentists, and reviews\n4. **Click 'Book Appointment'** - Available on every clinic profile\n5. **Choose Your Time** - See real-time availability\n6. **Fill Details** - Your info and reason for visit\n7. **Confirm Booking** - Get instant email confirmation!\n\n**What You Need:**\n• Your contact information\n• Preferred date and time\n• Reason for visit (checkup, cleaning, specific treatment)\n• Insurance info (if applicable)\n\n**After Booking:**\n• You'll get an email confirmation\n• Clinic will review and approve your request\n• You can manage all appointments in your patient portal\n• Get reminders before your visit\n\n**Pro Tips:**\n• Book during off-peak hours for better availability\n• Check clinic reviews before booking\n• Some clinics offer online consultation first\n• You can reschedule easily if needed\n\nReady to book? Just find a clinic you like and click that 'Book Appointment' button! 😊"
        ],

        'quick_action_find' => [
            'keywords' => ['find clinics near me', 'find clinic', 'search clinic', 'nearby clinic', 'clinic search'],
            'response' => "I'll help you find the perfect dental clinic! Here's how our search works: 🔍\n\n**Search Options:**\n• **By Location** - Enter your city or address\n• **By Services** - Looking for braces? Orthodontics? Implants?\n• **By Availability** - See which clinics have open slots\n• **By Ratings** - Find highly-rated clinics\n\n**What You'll See:**\n• **Clinic Profiles** - Complete information about each clinic\n• **Dentist Information** - Meet the dental team\n• **Services Offered** - What treatments they provide\n• **Patient Reviews** - Real feedback from other patients\n• **Pricing Info** - Transparent cost information\n• **Operating Hours** - When they're open\n• **Contact Details** - Phone, email, address\n\n**Advanced Filters:**\n• **Distance** - How far from your location\n• **Specialties** - General, cosmetic, orthodontics, etc.\n• **Insurance** - Which insurance they accept\n• **Languages** - What languages they speak\n• **Accessibility** - Wheelchair accessible, etc.\n\n**The Best Part:**\n• **Book Directly** - No need to call around\n• **Real-time Availability** - See actual open slots\n• **Instant Confirmation** - Get confirmed right away\n• **Easy Comparison** - Compare clinics side by side\n\n**Pro Tips:**\n• Read patient reviews to find the right fit\n• Check if they offer the services you need\n• Look at their before/after photos\n• Consider location and parking availability\n\nReady to find your perfect clinic? Just start searching! 😊"
        ],

        'quick_action_services' => [
            'keywords' => ['what dental services are available', 'dental services', 'treatments available', 'what services do you offer'],
            'response' => "We offer a comprehensive range of dental services across all our clinics! Here's what you can find: 🦷✨\n\n**🦷 General Dentistry**\n• Regular checkups and cleanings\n• Fillings and cavity treatments\n• Root canals and extractions\n• Gum disease treatment\n• Oral cancer screenings\n\n**✨ Cosmetic Dentistry**\n• Teeth whitening (in-office and take-home)\n• Porcelain veneers\n• Dental bonding\n• Smile makeovers\n• Cosmetic fillings\n\n**🦷 Orthodontics**\n• Traditional metal braces\n• Clear ceramic braces\n• Invisalign clear aligners\n• Retainers and spacers\n• Orthodontic consultations\n\n**🏥 Specialized Care**\n• **Oral Surgery** - Wisdom teeth removal, dental implants\n• **Pediatric Dentistry** - Specialized care for children\n• **Emergency Services** - Same-day urgent care\n• **Periodontics** - Gum disease and surgery\n• **Endodontics** - Root canal specialists\n• **Prosthodontics** - Crowns, bridges, dentures\n\n**💎 Advanced Treatments**\n• **Dental Implants** - Permanent tooth replacement\n• **Full Mouth Reconstruction** - Complete smile makeovers\n• **TMJ Treatment** - Jaw pain and disorders\n• **Sleep Apnea Treatment** - Oral appliances\n• **Sedation Dentistry** - For anxious patients\n\n**What Makes Us Special:**\n• **Modern Technology** - Latest dental equipment\n• **Experienced Dentists** - Highly qualified professionals\n• **Comfortable Environment** - Relaxing, modern clinics\n• **Flexible Payment** - Multiple payment options\n• **Insurance Accepted** - Most major insurance plans\n\n**How to Find Services:**\n• Each clinic shows exactly what they offer\n• Filter clinics by specific services\n• See pricing and time estimates\n• Book appointments for specific treatments\n\nLooking for something specific? Just let me know what dental care you need! 😊"
        ],

        'quick_action_platform' => [
            'keywords' => ['tell me about smile suite platform', 'smile suite platform', 'what is smile suite', 'platform features'],
            'response' => "Smile Suite is a revolutionary dental clinic management platform designed specifically for the Philippines! 🇵🇭✨\n\n**What is Smile Suite?**\nSmile Suite is a comprehensive cloud-based platform that connects patients with dental clinics, making dental care more accessible and organized than ever before!\n\n**🏥 For Patients:**\n• **Clinic Discovery** - Find the best dental clinics near you\n• **Easy Booking** - Book appointments online 24/7\n• **Patient Portal** - Manage all your dental records in one place\n• **Treatment History** - Access your complete dental history\n• **Payment Options** - Multiple convenient payment methods\n• **Reviews & Ratings** - Read real patient experiences\n\n**🏥 For Dental Clinics:**\n• **Complete Management** - Patient records, appointments, inventory\n• **Online Booking** - Let patients book appointments directly\n• **Financial Tracking** - Revenue, payments, and billing\n• **Staff Management** - Dentists, assistants, and admin\n• **Inventory Control** - Track supplies and materials\n• **Reporting** - Detailed analytics and insights\n\n**🌟 Key Features:**\n• **Multi-tenant Architecture** - Each clinic has secure, separate data\n• **Real-time Scheduling** - Live availability and booking\n• **Philippine Integration** - PSGC codes, local payment methods\n• **Mobile Responsive** - Works perfectly on all devices\n• **Secure & Compliant** - HIPAA-level data protection\n• **24/7 Support** - Always here to help\n\n**💡 Why Choose Smile Suite?**\n• **Made for Philippines** - Built with local needs in mind\n• **Modern Technology** - Latest web technologies\n• **User-Friendly** - Easy to use for everyone\n• **Comprehensive** - Everything you need in one platform\n• **Reliable** - 99.9% uptime guarantee\n• **Affordable** - Competitive pricing for all clinics\n\n**🚀 Getting Started:**\n• **For Patients** - Browse clinics and book appointments\n• **For Clinics** - Start with a 14-day free trial\n• **Support** - Our team is here to help you succeed\n\nReady to experience the future of dental care? Let's get started! 😊"
        ],

        'quick_action_patient' => [
            'keywords' => ['how does patient registration work', 'patient registration', 'patient portal', 'patient account'],
            'response' => "Patient registration is simple and secure! Here's everything you need to know: 👤\n\n**Registration Process:**\n1. **Sign Up** - Create your account on our website\n2. **Email Verification** - Verify your email with a code\n3. **Profile Setup** - Add your personal information\n4. **Record Claiming** - Link to existing clinic records (if any)\n5. **Account Activation** - Full access to patient portal\n\n**What You Need to Register:**\n• **Email Address** - For account verification\n• **Password** - Secure password (minimum 8 characters)\n• **Full Name** - Your complete name\n• **Phone Number** - Contact information\n• **Date of Birth** - For record matching\n• **Address** - Complete Philippine address\n\n**Patient Portal Features:**\n• **Appointment Management** - Book, reschedule, cancel appointments\n• **Treatment History** - View all your dental records\n• **Payment History** - Track all payments and bills\n• **Profile Management** - Update your information\n• **Insurance Info** - Manage insurance details\n• **Emergency Contacts** - Keep emergency info updated\n\n**Record Claiming System:**\n• **Existing Patients** - If you've been to a clinic before\n• **Automatic Matching** - We'll find your records\n• **Manual Claiming** - Search by name, phone, or email\n• **Verification Process** - Secure record linking\n• **Complete History** - Access all your dental records\n\n**Security Features:**\n• **Data Encryption** - All data is encrypted\n• **Secure Login** - Two-factor authentication available\n• **Privacy Protection** - Your data is private and secure\n• **Audit Trails** - Track all account activity\n• **GDPR Compliant** - Full data protection compliance\n\n**Getting Help:**\n• **Support Team** - We're here to help with registration\n• **Video Tutorials** - Step-by-step guides\n• **Live Chat** - Get instant help\n• **Email Support** - Detailed assistance\n\n**Pro Tips:**\n• Use a strong, unique password\n• Keep your email address updated\n• Add emergency contacts\n• Enable two-factor authentication\n• Check your spam folder for verification emails\n\nReady to create your account? It only takes a few minutes! 😊"
        ],

        'quick_action_payment' => [
            'keywords' => ['what payment methods do you accept', 'payment methods', 'how to pay', 'payment options'],
            'response' => "We offer flexible and convenient payment options to make dental care accessible! 💳\n\n**💵 Payment Methods We Accept:**\n• **Cash** - Traditional cash payments at the clinic\n• **Credit/Debit Cards** - Visa, Mastercard, American Express\n• **GCash** - Philippines' most popular e-wallet\n• **PayMaya** - Another great e-wallet option\n• **Bank Transfer** - Direct transfer from your bank\n• **Insurance** - Most major insurance providers\n• **Check** - Personal and business checks\n\n**🏦 Online Payment Features:**\n• **Secure Processing** - Bank-level security\n• **Instant Confirmation** - Immediate payment confirmation\n• **Receipt Generation** - Professional receipts\n• **Payment History** - Track all transactions\n• **Refund Processing** - Easy refunds when needed\n\n**💡 Payment Plans Available:**\n• **Split Payments** - Pay in multiple installments\n• **Treatment Financing** - Special financing for major treatments\n• **Monthly Plans** - Spread costs over time\n• **Insurance Claims** - We handle the paperwork\n• **Flexible Terms** - Work with your budget\n\n**🏥 Insurance Integration:**\n• **Coverage Verification** - Check your benefits before treatment\n• **Claims Processing** - We handle all the paperwork\n• **Pre-authorization** - Get approval before major treatments\n• **Co-payment Calculation** - Know exactly what you'll pay\n• **Direct Billing** - Bill insurance directly\n\n**💰 Transparent Pricing:**\n• **No Hidden Fees** - All costs are upfront\n• **Clear Breakdown** - Detailed cost explanations\n• **Price Estimates** - Get estimates before treatment\n• **Payment Options** - Choose what works for you\n• **Discounts** - Special offers and promotions\n\n**🔒 Security & Privacy:**\n• **PCI Compliant** - Highest security standards\n• **Encrypted Data** - All payment data is encrypted\n• **Secure Storage** - Safe payment information storage\n• **Fraud Protection** - Advanced fraud detection\n• **Privacy Policy** - Your data is protected\n\n**📱 Mobile Payments:**\n• **Mobile Optimized** - Easy payment on mobile\n• **QR Code Payments** - Quick and convenient\n• **Mobile Wallets** - GCash, PayMaya integration\n• **Touch Payments** - Apple Pay, Google Pay support\n\n**Need Help with Payment?**\n• **Payment Support** - Our team can help\n• **Payment Plans** - Discuss flexible options\n• **Insurance Questions** - Get coverage help\n• **Billing Inquiries** - Understand your charges\n\nReady to book? Don't worry about payment - we've got you covered! 😊"
        ],

        'quick_action_contact' => [
            'keywords' => ['how can i contact a clinic', 'contact clinic', 'clinic contact info', 'get in touch'],
            'response' => "Getting in touch with clinics is easy! Here are all the ways to contact them: 📞\n\n**📱 Direct Contact Methods:**\n• **Phone Calls** - Call the clinic directly\n• **Email** - Send detailed messages\n• **SMS** - Quick text messages\n• **WhatsApp** - Popular messaging app\n• **Facebook Messenger** - Social media contact\n\n**🌐 Online Contact Options:**\n• **Clinic Website** - Visit their official website\n• **Contact Forms** - Fill out online forms\n• **Live Chat** - Real-time chat support\n• **Video Calls** - Virtual consultations\n• **Online Booking** - Book appointments directly\n\n**📍 In-Person Contact:**\n• **Visit the Clinic** - Walk-in consultations\n• **Office Hours** - Check their operating hours\n• **Emergency Contact** - 24/7 emergency numbers\n• **Appointment Visits** - Scheduled consultations\n\n**💬 Smile Suite Contact Features:**\n• **Clinic Directory** - Find all contact information\n• **Direct Messaging** - Message clinics through our platform\n• **Appointment Requests** - Contact through booking system\n• **Review System** - Leave feedback and questions\n• **Support Team** - We can help connect you\n\n**📋 What Information You'll Find:**\n• **Complete Address** - Full clinic location\n• **Phone Numbers** - Main and emergency numbers\n• **Email Addresses** - General and specific contacts\n• **Social Media** - Facebook, Instagram, Twitter\n• **Website Links** - Official clinic websites\n• **Operating Hours** - When they're available\n• **Emergency Hours** - After-hours contact\n\n**🎯 Best Ways to Contact:**\n• **General Questions** - Email or phone\n• **Appointment Booking** - Use our online system\n• **Emergency Issues** - Call directly\n• **Follow-up Care** - Use patient portal\n• **Insurance Questions** - Contact clinic directly\n\n**💡 Pro Tips:**\n• **Check Hours** - Make sure they're open\n• **Be Specific** - Explain what you need\n• **Have Info Ready** - Insurance, ID, etc.\n• **Follow Up** - Don't hesitate to call back\n• **Use Online Booking** - Often faster than calling\n\n**🚨 Emergency Contacts:**\n• **Dental Emergencies** - Call clinic emergency line\n• **After Hours** - Check for emergency services\n• **Urgent Care** - Some clinics offer urgent care\n• **Hospital Referrals** - For serious emergencies\n\nNeed help finding a specific clinic's contact info? Just let me know! 😊"
        ],

        'quick_action_help' => [
            'keywords' => ['i need help with something', 'help and support', 'support', 'assistance', 'troubleshooting'],
            'response' => "I'm here to help you with anything you need! Here's how I can assist you: 🤝\n\n**🆘 Immediate Help:**\n• **General Questions** - Ask me anything about Smile Suite\n• **Technical Issues** - Problems with the website or app\n• **Account Problems** - Login, password, or account issues\n• **Booking Help** - Appointment booking assistance\n• **Payment Issues** - Payment or billing problems\n\n**📚 Self-Help Resources:**\n• **FAQ Section** - Common questions and answers\n• **Video Tutorials** - Step-by-step guides\n• **User Manual** - Complete platform guide\n• **Troubleshooting** - Fix common issues\n• **Best Practices** - Tips for using the platform\n\n**🎯 Specific Help Areas:**\n• **Finding Clinics** - Search and discovery help\n• **Booking Appointments** - Scheduling assistance\n• **Patient Portal** - Account management help\n• **Payment Methods** - Payment option guidance\n• **Technical Support** - Website and app issues\n• **Account Management** - Profile and settings help\n\n**📞 Direct Support Options:**\n• **Live Chat** - Real-time chat with our team\n• **Email Support** - Detailed help via email\n• **Phone Support** - Call our support team\n• **Video Call** - Screen sharing for complex issues\n• **Ticket System** - Track your support requests\n\n**🔧 Common Issues I Can Help With:**\n• **Can't Find a Clinic** - Search and filter help\n• **Booking Problems** - Appointment scheduling issues\n• **Login Issues** - Account access problems\n• **Payment Errors** - Payment processing help\n• **Mobile Problems** - Mobile app or website issues\n• **Account Questions** - Profile and settings help\n\n**💡 Quick Solutions:**\n• **Clear Browser Cache** - Fix loading issues\n• **Check Internet Connection** - Ensure stable connection\n• **Try Different Browser** - Switch browsers if needed\n• **Update App** - Keep mobile app updated\n• **Check Email** - Look for verification emails\n\n**🚀 Getting Started Help:**\n• **New User Guide** - Complete getting started guide\n• **Account Setup** - Step-by-step account creation\n• **First Appointment** - How to book your first visit\n• **Platform Tour** - Learn all the features\n• **Best Practices** - Tips for using the platform\n\n**📋 Before You Contact Support:**\n• **Check FAQ** - Your answer might be there\n• **Try Troubleshooting** - Common fixes\n• **Gather Info** - Have your details ready\n• **Describe Problem** - Be specific about the issue\n• **Include Screenshots** - Visual help is great\n\n**What specific help do you need?** Just tell me what's going on, and I'll do my best to help you! 😊"
        ],

        // === GENERAL HELP ===
        'general_help' => [
            'keywords' => ['help', 'support', 'how to', 'guide', 'tutorial', 'faq'],
            'response' => "Hi there! I'm SmileyDy, your friendly dental assistant! 😊\n\nI'm here to help you with everything about Smile Suite. Whether you're looking to find a dental clinic, book an appointment, or learn about our services, I've got you covered!\n\nWhat would you like to know? I can help you with:\n• Finding the perfect dental clinic near you\n• Booking appointments online\n• Understanding our dental services\n• Managing your account\n• Getting technical support\n\nJust ask me anything - I'm here to make your dental care journey smooth and easy! 🦷✨"
        ],

        'general' => [
            'keywords' => ['hello', 'hi', 'help', 'what', 'how', 'when', 'where', 'thanks', 'thank you'],
            'response' => "Hey there! I'm SmileyDy, your friendly dental assistant! 😊\n\nI'm here to help you with everything about Smile Suite! Whether you're looking to find a great dental clinic, book an appointment, learn about our services, or just have questions about dental care - I've got you covered!\n\nWhat can I help you with today? I'm excited to make your dental care journey smooth and easy! 🦷✨"
        ]
    ];

    public function chat(Request $request): JsonResponse
    {
        try {
            $message = $request->input('message', '');

            if (empty($message)) {
                return response()->json([
                    'response' => "Please send me a message so I can help you!"
                ]);
            }

            // First, try to match with our knowledge base
            $knowledgeResponse = $this->getKnowledgeBaseResponse($message);

            if ($knowledgeResponse) {
                return response()->json([
                    'response' => $knowledgeResponse
                ]);
            }

            // If no knowledge base match, try AI API (free tier)
            $aiResponse = $this->getAIResponse($message);

            return response()->json([
                'response' => $aiResponse
            ]);

        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage());

            return response()->json([
                'response' => "I'm sorry, I'm having trouble right now. Please try again or contact us directly for assistance!"
            ]);
        }
    }

    private function getKnowledgeBaseResponse(string $message): ?string
    {
        $message = strtolower($message);

        foreach ($this->dentalKnowledge as $category => $data) {
            foreach ($data['keywords'] as $keyword) {
                if (strpos($message, $keyword) !== false) {
                    return $data['response'];
                }
            }
        }

        return null;
    }

    private function getAIResponse(string $message): string
    {
        // Simple fallback response for now
        return "I'm here to help with dental clinic questions! You can ask me about booking appointments, finding clinics, our services, or anything else about Smile Suite. What would you like to know?";
    }

    private function formatAIResponse(string $response): string
    {
        // Clean up AI response and make it more dental-focused
        $response = trim($response);

        // Add dental context if response seems generic
        if (strlen($response) < 20) {
            $response = "I'd be happy to help you with that! For more specific dental information, I recommend checking our clinic directory or contacting a clinic directly.";
        }

        return $response;
    }
}
