# 🦷 Smile Suite: Cloud-Based Dental Clinic Management System

A comprehensive, modern dental clinic management platform built with Laravel, React, and Inertia.js. Smile Suite provides a complete SaaS solution for dental clinics in the Philippines, featuring patient management, appointment scheduling, inventory tracking, and subscription management.

## 🚀 **Project Status**

### ✅ **Completed Modules**

-   **Public Pages**: Landing page, clinic directory, clinic profiles, reviews system
-   **Admin System**: Dashboard, user management, clinic management, registration requests, subscription management
-   **Patient Management**: Basic patient CRUD operations (partially working)
-   **Subscription System**: Complete duration management, trial periods, grace periods, notifications
-   **Registration Flow**: Complete clinic registration workflow with payment simulation
-   **Email System**: Professional email templates for all notifications

### 🔄 **In Progress**

-   **Clinic Management System**: Core modules implemented but need completion
-   **Patient Management**: Basic functionality working, needs enhancement
-   **Appointment System**: Partially implemented
-   **Inventory System**: Basic structure in place

### 📋 **Pending Features**

-   Complete appointment scheduling and management
-   Treatment planning and tracking
-   Financial reporting and analytics
-   Advanced patient management features
-   Mobile responsiveness improvements
-   Real payment gateway integration

## 🏗️ **Architecture Overview**

### **Backend Stack**

-   **Framework**: Laravel 11.x (PHP 8.2+)
-   **Database**: MySQL with comprehensive migrations
-   **Authentication**: Laravel Breeze with Sanctum
-   **API**: RESTful API with Inertia.js integration
-   **Queue System**: Laravel queues for background jobs
-   **Caching**: Redis/File-based caching
-   **Email**: Laravel Mail with professional templates

### **Frontend Stack**

-   **Framework**: React 18.x with Inertia.js
-   **Styling**: Tailwind CSS with shadcn/ui components
-   **Icons**: Lucide React icons
-   **Charts**: Recharts for data visualization
-   **Forms**: React Hook Form with validation
-   **Build Tool**: Vite for fast development

### **Key Libraries & Tools**

-   **UI Components**: shadcn/ui (Radix UI primitives)
-   **Date Handling**: date-fns and moment.js
-   **Maps**: Leaflet for location services
-   **QR Codes**: react-qr-code for payment integration
-   **Notifications**: react-hot-toast and sonner
-   **Drag & Drop**: @dnd-kit for interactive features

## 📁 **Project Structure**

```
smile_suite/
├── app/
│   ├── Console/Commands/          # Automated tasks (subscription checks)
│   ├── Http/
│   │   ├── Controllers/           # MVC controllers organized by module
│   │   │   ├── Admin/            # Admin panel controllers
│   │   │   ├── Clinic/           # Clinic management controllers
│   │   │   ├── Public/           # Public-facing controllers
│   │   │   └── Patient/          # Patient-specific controllers
│   │   ├── Middleware/           # Custom middleware
│   │   └── Requests/             # Form validation requests
│   ├── Mail/                     # Email templates and classes
│   ├── Models/                   # Eloquent models with relationships
│   ├── Policies/                 # Authorization policies
│   └── Services/                 # Business logic services
├── database/
│   ├── migrations/               # Database schema migrations
│   ├── seeders/                  # Database seeders
│   └── data/                     # PSGC (Philippine geography) data
├── resources/
│   ├── js/
│   │   ├── Components/           # Reusable React components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── Layouts/             # Page layouts
│   │   ├── Pages/               # Inertia.js pages
│   │   │   ├── Admin/           # Admin panel pages
│   │   │   ├── Clinic/          # Clinic management pages
│   │   │   ├── Public/          # Public pages
│   │   │   └── Patient/         # Patient pages
│   │   └── types/               # TypeScript definitions
│   └── views/                   # Blade templates (minimal usage)
└── routes/                      # Laravel route definitions
```

## 🎯 **Core Features**

### **1. Multi-Tenant Architecture**

-   Clinic isolation with proper data segregation
-   Role-based access control (admin, clinic_admin, dentist, staff)
-   Subscription-based access management

### **2. Subscription Management**

-   **Trial System**: 14-day free trials for new clinics
-   **Grace Periods**: 7-day grace period after expiration
-   **Automatic Monitoring**: Console commands for status checks
-   **Email Notifications**: Professional notification system
-   **Admin Controls**: Manual trial extensions and renewals

### **3. Clinic Registration Flow**

```
Registration → Admin Review → Approval → Payment → Setup → Active
```

-   Complete workflow with email notifications
-   Payment simulation (GCash, PayMaya, Bank Transfer)
-   Secure setup process with token-based authentication

### **4. Patient Management**

-   Comprehensive patient profiles with medical history
-   Address management using Philippine geography data (PSGC)
-   Emergency contact information
-   Insurance and payment tracking
-   Soft delete functionality

### **5. Inventory System**

-   Stock management with low-level alerts
-   Supplier management and tracking
-   Category-based organization
-   Quick quantity adjustments
-   Value calculations

### **6. Public Directory**

-   Clinic discovery and profiles
-   Review and rating system
-   Online appointment booking
-   Location-based search (coordinates support)

## 🔧 **Development Setup**

### **Prerequisites**

-   PHP 8.2+
-   Node.js 18+
-   MySQL 8.0+
-   Composer
-   npm/yarn

### **Installation**

1. **Clone the repository**

```bash
git clone <repository-url>
cd smile_suite
```

2. **Install PHP dependencies**

```bash
composer install
```

3. **Install Node.js dependencies**

```bash
npm install
```

4. **Environment setup**

```bash
cp .env.example .env
php artisan key:generate
```

5. **Database setup**

```bash
php artisan migrate
php artisan db:seed
```

6. **Build assets**

```bash
npm run dev
```

7. **Start development server**

```bash
php artisan serve
```

### **Environment Configuration**

Key environment variables:

```env
APP_NAME="Smile Suite"
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smile_suite
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

## 🚀 **Deployment**

### **Production Requirements**

-   PHP 8.2+ with required extensions
-   MySQL 8.0+ or PostgreSQL
-   Redis (for caching and queues)
-   Web server (Nginx/Apache)
-   SSL certificate
-   Email service (SMTP)

### **Deployment Steps**

1. Set up production environment
2. Configure environment variables
3. Run database migrations
4. Build production assets: `npm run build`
5. Set up cron jobs for subscription checks
6. Configure web server
7. Set up SSL certificate

## 📊 **Database Schema**

### **Core Tables**

-   `users` - User accounts with role-based access
-   `clinics` - Clinic information and subscription data
-   `patients` - Patient records with medical history
-   `appointments` - Appointment scheduling and management
-   `treatments` - Treatment plans and procedures
-   `inventory` - Stock management
-   `suppliers` - Supplier information
-   `payments` - Payment tracking
-   `reviews` - Clinic reviews and ratings

### **Key Relationships**

-   Clinics have many Users, Patients, Appointments, etc.
-   Users belong to Clinics with specific roles
-   Patients belong to Clinics
-   All clinic-specific data is properly isolated

## 🔐 **Security Features**

-   **Authentication**: Laravel Breeze with email verification
-   **Authorization**: Role-based policies for all resources
-   **Data Isolation**: Clinic-specific data segregation
-   **CSRF Protection**: Built-in Laravel CSRF protection
-   **Input Validation**: Comprehensive form validation
-   **SQL Injection Protection**: Eloquent ORM protection
-   **XSS Protection**: Proper output escaping

## 📧 **Email System**

### **Email Templates**

-   Clinic registration approval
-   Payment confirmation
-   Trial expiration notifications
-   Appointment confirmations
-   Setup instructions

### **Email Features**

-   Professional HTML templates
-   Responsive design
-   Branded with Smile Suite styling
-   Multi-language support ready

## 🧪 **Testing**

### **Available Commands**

```bash
# Run subscription expiration checks
php artisan subscriptions:check-expirations

# Test email functionality
php artisan test:email

# Check payment expirations
php artisan payments:check-expirations
```

### **Testing Features**

-   Automated subscription monitoring
-   Email delivery testing
-   Payment simulation
-   Database seeding for development

## 📈 **Monitoring & Analytics**

### **Admin Dashboard Features**

-   Clinic registration statistics
-   Subscription status overview
-   User activity monitoring
-   Revenue tracking (simulated)
-   System health indicators

### **Clinic Dashboard Features**

-   Patient statistics
-   Appointment overview
-   Inventory alerts
-   Financial summaries
-   Recent activity feeds

## 🔄 **Development Workflow**

### **Code Organization**

-   **Controllers**: Organized by module (Admin, Clinic, Public)
-   **Models**: Eloquent models with proper relationships
-   **Policies**: Authorization rules for each resource
-   **Services**: Business logic separated from controllers
-   **Components**: Reusable React components with shadcn/ui

### **Coding Standards**

-   Laravel best practices
-   PSR-12 coding standards
-   Component-based React architecture
-   Tailwind CSS utility classes
-   Inertia.js for seamless SPA experience

## 🎨 **UI/UX Design**

### **Design System**

-   **Colors**: Professional blue/purple gradient theme
-   **Typography**: Inter font family
-   **Components**: shadcn/ui component library
-   **Icons**: Lucide React icon set
-   **Responsive**: Mobile-first design approach

### **Key UI Features**

-   Modern dashboard layouts
-   Interactive charts and graphs
-   Smooth animations and transitions
-   Professional email templates
-   Mobile-responsive design

## 📚 **Documentation**

### **Available Documentation**

-   `CLINIC_REGISTRATION_FLOW.md` - Complete registration process
-   `INVENTORY_SYSTEM_README.md` - Inventory management guide
-   `PHASE_2A_COMPLETION_SUMMARY.md` - Subscription system details
-   `EMAIL_SETUP_GUIDE.md` - Email configuration guide
-   `PHILIPPINE_PAYMENT_SIMULATION_GUIDE.md` - Payment system guide

## 🤝 **Contributing**

### **Development Guidelines**

1. Follow Laravel and React best practices
2. Use proper Git workflow with feature branches
3. Write clear commit messages
4. Test thoroughly before submitting
5. Update documentation as needed

### **Code Review Process**

1. Create feature branch from main
2. Implement changes with proper testing
3. Submit pull request with detailed description
4. Code review and approval process
5. Merge to main branch

## 📞 **Support**

### **Technical Support**

-   Check existing documentation
-   Review issue tracker
-   Contact development team
-   Check Laravel and React documentation

### **Feature Requests**

-   Submit through issue tracker
-   Provide detailed requirements
-   Include use cases and examples
-   Consider impact on existing features

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 **Acknowledgments**

-   Laravel team for the excellent framework
-   React team for the powerful frontend library
-   shadcn/ui for the beautiful component library
-   Philippine Statistics Authority for PSGC data
-   All contributors and supporters

---

**Smile Suite** - Empowering dental clinics with modern technology 🇵🇭✨
