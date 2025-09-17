```markdown
# 🦷 Smile Suite - Complete Project Context for AI Assistants

## 🎯 **Quick Project Summary**

**Smile Suite** is a comprehensive cloud-based dental clinic management SaaS platform built for the Philippine market.

**Tech Stack**: Laravel 11.x + React 18.x + Inertia.js + Tailwind CSS + shadcn/ui
**Architecture**: Multi-tenant SaaS with subscription management
**Database**: MySQL with comprehensive relationships
**Authentication**: Laravel Breeze + Sanctum

## 🏗️ **Architecture Overview**

### **Multi-Tenant Structure**

-   **Clinic Isolation**: Complete data segregation between clinics
-   **Role-Based Access**: system_admin, clinic_staff (admin/dentist/staff), patient
-   **Subscription Management**: Trial periods, grace periods, automated monitoring

### **Core Modules**

1. **Admin System**: Platform management and clinic oversight
2. **Clinic Management**: Patient records, appointments, inventory, treatments
3. **Patient Portal**: Treatment history, appointment booking
4. **Public Directory**: Clinic discovery, reviews, online booking

## 🔑 **Key Models & Relationships**

### **User Model** (`app/Models/User.php`)

-   Multi-role system: system_admin, clinic_staff, patient
-   Dentist-specific fields: license_number, specialties, working_hours
-   Registration verification system

### **Clinic Model** (`app/Models/Clinic.php`)

-   Tenant isolation with subscription tracking
-   Geographic data (Philippine PSGC integration)
-   Operating hours, gallery images, services

### **Patient Model** (`app/Models/Patient.php`)

-   Comprehensive medical history and demographics
-   Email verification and user account linking
-   Category system (regular, VIP, pediatric, etc.)

### **Appointment Model** (`app/Models/Appointment.php`)

-   Advanced scheduling with recurring patterns
-   Status tracking and dentist assignment
-   Service integration and treatment linking

## 🎨 **Frontend Architecture**

### **Component Structure**
```

resources/js/
├── Components/
│ ├── ui/ (shadcn/ui components)
│ ├── Clinic/ (clinic-specific components)
│ └── Patient/ (patient-specific components)
├── Pages/
│ ├── Admin/ (admin panel pages)
│ ├── Clinic/ (clinic management pages)
│ ├── Patient/ (patient portal pages)
│ └── Public/ (public-facing pages)
└── Layouts/ (page layouts)

```

### **UI Framework**
- **shadcn/ui**: Modern React components built on Radix UI
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Consistent icon system
- **Recharts**: Data visualization and analytics

## 🔐 **Security & Access Control**

### **Authentication Flow**
1. Laravel Breeze handles authentication
2. Role-based middleware controls access
3. Subscription status affects feature availability
4. Clinic isolation ensures data security

### **Permission System**
- **System Admin**: Full platform control
- **Clinic Admin**: Clinic management and user control
- **Dentist**: Patient care and scheduling
- **Staff**: Limited clinic operations
- **Patient**: Personal records and appointments

## 📊 **Database Schema Highlights**

### **Subscription Management**
- Trial periods (14 days default)
- Grace periods (7 days after expiration)
- Automated status monitoring via console commands
- Payment tracking and renewal notifications

### **Geographic Integration**
- Philippine Standard Geographic Code (PSGC) data
- Region, province, city, municipality, barangay support
- Location-based clinic discovery

## 🚀 **Current Implementation Status**

### ✅ **Completed**
- Admin system with full clinic management
- Public clinic directory and booking
- Subscription management with automated monitoring
- Email notification system
- Basic patient and appointment management
- Inventory structure and supplier management

### 🔄 **In Progress**
- Advanced appointment scheduling features
- Complete inventory workflow
- Comprehensive reporting system

### 📋 **Pending**
- Real payment gateway integration (currently simulated)
- Mobile app integration
- Advanced analytics dashboard

## 💡 **Development Guidelines**

### **When Adding New Features**
1. Follow Laravel best practices and PSR-12 standards
2. Use existing shadcn/ui components for consistency
3. Implement proper role-based access control
4. Ensure clinic data isolation
5. Add appropriate validation and error handling

### **File Organization Patterns**
- Controllers organized by module (Admin/, Clinic/, Public/)
- Models with comprehensive relationships and scopes
- React components follow feature-based organization
- Services handle complex business logic

## 🔧 **Key Configuration Files**
- `composer.json`: Laravel dependencies and autoloading
- `package.json`: React and build tool dependencies
- `vite.config.js`: Frontend build configuration
- `tailwind.config.js`: UI styling configuration
- `.env.example`: Environment variable template

## 📧 **Email System**
- Professional HTML templates in `resources/views/emails/`
- Automated notifications for subscriptions, appointments, payments
- Gmail SMTP integration ready

## 🎯 **Common Development Tasks**

### **Adding New Clinic Features**
1. Create controller in `app/Http/Controllers/Clinic/`
2. Add routes in `routes/web.php` under clinic middleware
3. Create React page in `resources/js/Pages/Clinic/`
4. Implement proper subscription access control

### **Database Changes**
1. Create migration with proper foreign keys
2. Update model relationships
3. Add appropriate policies for authorization
4. Update seeders if needed

### **UI Components**
1. Use existing shadcn/ui components when possible
2. Follow Tailwind CSS utility patterns
3. Implement proper loading states and error handling
4. Ensure mobile responsiveness

---

**Last Updated**: Current as of comprehensive codebase analysis
**For AI Assistants**: This file provides complete context for understanding and working with the Smile Suite codebase.
```
