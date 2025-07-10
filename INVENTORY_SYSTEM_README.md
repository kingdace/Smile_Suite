# Smile Suite - Inventory Management System

## Overview

The Inventory Management System is a comprehensive digital solution for dental clinics to manage their supplies, equipment, and medications. It provides a modern, user-friendly interface for tracking inventory levels, managing suppliers, and ensuring efficient stock management.

## Features

### Inventory Management

-   **Add Inventory Items**: Create new inventory items with detailed information
-   **View Inventory**: Browse all inventory items with search and filter capabilities
-   **Edit Items**: Update inventory item details including quantities and prices
-   **Quick Adjust**: Rapidly adjust quantities directly from the inventory list
-   **Low Stock Alerts**: Visual indicators for items that need restocking
-   **Category Management**: Organize items by categories (Dental Supplies, Equipment, Medications, Other)

### Supplier Management

-   **Add Suppliers**: Register new suppliers with contact information
-   **View Suppliers**: Browse supplier directory with search functionality
-   **Edit Suppliers**: Update supplier information and contact details
-   **Supplier-Inventory Linking**: Associate inventory items with their suppliers
-   **Supplier Performance**: View which items each supplier provides

### Dashboard Integration

-   **Low Stock Overview**: Quick view of items needing restocking
-   **Inventory Summary**: Total items, categories, and value calculations
-   **Supplier Summary**: Total suppliers and active supplier count

## Database Structure

### Inventory Table

-   `id` - Primary key
-   `clinic_id` - Foreign key to clinics table
-   `supplier_id` - Foreign key to suppliers table
-   `name` - Item name
-   `description` - Detailed description
-   `quantity` - Current stock quantity
-   `minimum_quantity` - Minimum stock level for alerts
-   `unit_price` - Price per unit
-   `category` - Item category
-   `notes` - Additional notes
-   `created_at`, `updated_at`, `deleted_at` - Timestamps

### Suppliers Table

-   `id` - Primary key
-   `clinic_id` - Foreign key to clinics table
-   `name` - Supplier name
-   `contact_person` - Primary contact
-   `email` - Contact email
-   `phone` - Contact phone
-   `address` - Supplier address
-   `tax_id` - Tax identification number
-   `payment_terms` - Payment terms
-   `notes` - Additional notes
-   `created_at`, `updated_at`, `deleted_at` - Timestamps

## Usage Guide

### Adding a New Inventory Item

1. Navigate to Inventory → Add Item
2. Fill in the required fields:
    - Name: Item name
    - Category: Select from dropdown
    - Quantity: Current stock level
    - Minimum Quantity: Alert threshold
    - Unit Price: Cost per unit
    - Supplier: Select from existing suppliers
    - Description: Detailed description
    - Notes: Optional additional information
3. Click "Add Item" to save

### Managing Suppliers

1. Navigate to Suppliers → Add Supplier
2. Fill in supplier information:
    - Name: Supplier company name
    - Contact Person: Primary contact
    - Email: Contact email
    - Phone: Contact phone
    - Address: Full address
    - Tax ID: Business tax identification
    - Payment Terms: Payment conditions
    - Notes: Additional information
3. Click "Add Supplier" to save

### Quick Quantity Adjustment

1. From the Inventory list, click "Quick Adjust" on any item
2. Enter the new quantity in the prompt
3. Click OK to update immediately

### Search and Filter

-   Use the search bar to find items by name or description
-   Use the category filter to view items by type
-   Search suppliers by name, contact person, or email

## Navigation

-   **Sidebar**: Access Inventory and Suppliers from the main navigation
-   **Quick Links**: Navigate between Inventory and Suppliers using the action buttons
-   **Breadcrumbs**: Use the "Back to List" buttons to return to overview pages

## Security Features

-   **Clinic Isolation**: Each clinic can only access their own inventory and suppliers
-   **User Authentication**: All inventory operations require proper authentication
-   **Data Validation**: Server-side validation ensures data integrity
-   **Soft Deletes**: Items are soft-deleted to maintain data history

## Technical Implementation

-   **Frontend**: React.js with Inertia.js
-   **Backend**: Laravel PHP framework
-   **Database**: MySQL with proper relationships
-   **UI Components**: Custom UI components with Tailwind CSS
-   **State Management**: Inertia.js for seamless SPA experience

## Future Enhancements

-   Barcode scanning for quick item lookup
-   Automated reorder notifications
-   Inventory usage tracking
-   Supplier performance analytics
-   Bulk import/export functionality
-   Mobile app support

## Support

For technical support or feature requests, please contact the development team.
