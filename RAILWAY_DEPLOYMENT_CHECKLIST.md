# 🚂 Railway Deployment Checklist for Smile Suite

## 📋 **Summary of Changes**

### **New Features Added:**

1. ✅ **In-App Notifications System** (Clinic & Admin)
2. ✅ **Help & Support Ticket System** (Clinic requests to Admin)
3. ✅ **Admin Support Management** (Full ticket management interface)
4. ✅ **Enhanced Activity Logging** (Field-level change tracking)

---

## 🗄️ **Database Migration Steps**

### **1. Run SQL Script in HeidiSQL**

**File**: `railway_migrations.sql`

**Steps**:

1. Connect to Railway MySQL via HeidiSQL
2. Open `railway_migrations.sql` file
3. Execute the entire script
4. Verify tables were created:
    ```sql
    SHOW TABLES LIKE 'notifications';
    SHOW TABLES LIKE 'support_tickets';
    SHOW TABLES LIKE 'support_ticket_messages';
    SHOW TABLES LIKE 'support_ticket_attachments';
    ```

### **2. Tables Created**

-   ✅ `notifications` - In-app notifications for clinic & admin
-   ✅ `support_tickets` - Support ticket submissions from clinics
-   ✅ `support_ticket_messages` - Messages between clinic and admin
-   ✅ `support_ticket_attachments` - File attachments for tickets

### **3. Tables Modified**

-   ✅ `notifications` - `clinic_id` made nullable for admin-only notifications

---

## 📦 **New Files to Push to Railway**

### **Backend** (app/):

-   `app/Http/Controllers/Admin/AdminNotificationController.php`
-   `app/Http/Controllers/Admin/AdminSupportTicketController.php`
-   `app/Http/Controllers/Clinic/NotificationController.php`
-   `app/Http/Controllers/Clinic/SupportTicketController.php`
-   `app/Models/Notification.php`
-   `app/Models/SupportTicket.php`
-   `app/Models/SupportTicketMessage.php`
-   `app/Models/SupportTicketAttachment.php`
-   `app/Services/NotificationService.php`
-   `app/Helpers/StorageHelper.php` (Modified - added file handling)

### **Frontend** (resources/js/):

-   `resources/js/Components/NotificationBell.jsx`
-   `resources/js/Components/NotificationDropdown.jsx`
-   `resources/js/Components/NotificationPreview.jsx`
-   `resources/js/Components/AdminNotificationBell.jsx`
-   `resources/js/Components/AdminNotificationDropdown.jsx`
-   `resources/js/Components/AdminNotificationPreview.jsx`
-   `resources/js/Components/SupportTicketForm.jsx`
-   `resources/js/Pages/Clinic/Notifications/Index.jsx`
-   `resources/js/Pages/Clinic/Support/Index.jsx`
-   `resources/js/Pages/Clinic/Support/Show.jsx`
-   `resources/js/Pages/Admin/Support/Index.jsx`
-   `resources/js/Pages/Admin/Support/Show.jsx`
-   Modified: `resources/js/Layouts/AuthenticatedLayout.jsx`
-   Modified: `resources/js/Components/Sidebar.jsx`

### **Migrations** (database/migrations/):

-   `2025_10_24_231258_create_notifications_table.php`
-   `2025_10_25_112017_modify_notifications_table_for_admin_support.php`
-   `2025_10_25_122209_create_support_tickets_table.php`
-   `2025_10_25_122226_create_support_ticket_messages_table.php`
-   `2025_10_25_122241_create_support_ticket_attachments_table.php`
-   Modified: `database/seeders/PermissionSeeder.php`
-   Modified: `database/seeders/RolePermissionSeeder.php`

### **Routes** (routes/web.php):

-   Added Admin Support routes
-   Added Clinic Support routes
-   Added Notification routes

---

## 🔄 **Seeders**

**NOT NEEDED TO RUN**: The `PermissionSeeder` and `RolePermissionSeeder` have been updated but use `firstOrCreate()` so they won't break on re-execution. The new permissions will be added automatically when deployed.

---

## ✅ **Pre-Deployment Verification**

### **Checklist**:

-   [x] All new migrations created in `database/migrations/`
-   [x] SQL migration script created for Railway
-   [x] Seeders updated (will auto-run on Railway)
-   [x] All new controllers created
-   [x] All new models created
-   [x] All new services created
-   [x] Routes added to `routes/web.php`
-   [x] Frontend components created
-   [x] Frontend pages created
-   [x] StorageHelper updated for file handling
-   [x] NotificationService created
-   [x] Build completed successfully
-   [x] No linter errors

---

## 🚀 **Railway Deployment Steps**

### **Step 1: Run Database Migrations**

**In HeidiSQL (Connected to Railway MySQL)**:

1. Open `railway_migrations.sql`
2. Execute the full script
3. Verify tables exist

### **Step 2: Push Code to GitHub**

```bash
git add .
git commit -m "Add: Notifications & Support Ticket System"
git push origin main
```

### **Step 3: Railway Auto-Deploy**

Railway will automatically:

1. ✅ Pull latest code from GitHub
2. ✅ Install dependencies (`composer install`, `npm install`)
3. ✅ Build frontend (`npm run build`)
4. ✅ Run seeders (`php artisan db:seed`) - Will add new permissions

---

## 🔍 **Post-Deployment Verification**

### **Test These Features**:

1. **Clinic Notifications**:

    - Login as `clinic_admin`
    - Submit a support ticket
    - Check if notification bell shows unread count
    - Click bell to see notifications

2. **Admin Notifications**:

    - Login as `admin`
    - Check if notification bell shows new support ticket
    - Access `/admin/support` to manage tickets

3. **Support Tickets**:

    - Create ticket from clinic
    - Add attachments
    - Admin receives notification
    - Admin can reply with messages
    - Admin can update status
    - Clinic can view responses

4. **File Handling**:
    - Upload images/PDFs from clinic
    - Download attachments in admin
    - Preview images in support tickets

---

## ⚠️ **Important Notes**

### **Storage**:

-   ✅ Files stored locally in development
-   ✅ Files stored in AWS S3 in production
-   `StorageHelper` handles both environments automatically

### **Notifications**:

-   ✅ Clinic notifications - role-based filtering
-   ✅ Admin notifications - system-wide alerts
-   ✅ Real-time updates via polling

### **Permissions**:

-   ✅ New permissions auto-added via seeders
-   ✅ No manual permission assignment needed
-   ✅ Role-based access enforced

---

## 🆘 **Rollback Plan (If Needed)**

### **If Something Breaks**:

1. **Database Rollback** (HeidiSQL):

    ```sql
    DROP TABLE IF EXISTS support_ticket_attachments;
    DROP TABLE IF EXISTS support_ticket_messages;
    DROP TABLE IF EXISTS support_tickets;
    DROP TABLE IF EXISTS notifications;
    ```

2. **Code Rollback**:
    - Revert to previous commit in Railway
    - Or push previous working version

---

## ✅ **Files Ready for Deployment**

-   `railway_migrations.sql` - Run in HeidiSQL
-   All new migration files in `database/migrations/`
-   All new controller/model/service files
-   All new frontend components/pages
-   Modified: `routes/web.php`
-   Modified: `database/seeders/` (will auto-run)
-   Modified: `app/Helpers/StorageHelper.php`
-   Build files in `public/build/`

---

**🎉 Ready to Deploy! All systems are go!**
