# Design Document

## Overview

This design document outlines the UI improvements for the Treatment Management table. The changes focus on refining the information displayed in specific columns to improve readability and user experience. The modifications are purely presentational and do not affect the underlying data structure or business logic.

## Architecture

### Component Structure

The changes will be made to the Treatment Index component located at:

-   `resources/js/Pages/Clinic/Treatments/Index.jsx`

This is a React component using Inertia.js for server-side rendering and data management. The component receives treatment data from the Laravel backend with patient relationships already loaded.

### Data Flow

1. Laravel controller fetches treatments with patient relationships
2. Data is passed to the Inertia React component via props
3. Component renders the table using the shadcn/ui Table components
4. Each treatment row displays patient, treatment, cost, and date information

## Components and Interfaces

### Patient Column Redesign

**Current Implementation:**

-   Displays avatar with initials
-   Shows patient full name
-   Shows patient ID in a badge
-   Shows patient email in a badge

**New Implementation:**

-   Keep avatar with initials (no changes)
-   Display patient full name (no changes to styling)
-   Display contact number in place of ID badge
-   Display email address (keep existing badge styling)
-   Remove ID badge completely

**Visual Structure:**

```
[Avatar] Patient Name
         📞 Contact Number
         📧 Email Address
```

**Styling Approach:**

-   Contact number: Use a phone icon with text, styled similarly to the email badge
-   Email: Keep existing blue badge styling
-   Maintain vertical spacing with `space-y-1` class

### Treatment Column Redesign

**Current Implementation:**

-   Shows treatment name with stethoscope icon
-   Shows service name in a blue badge
-   Shows diagnosis with file icon
-   All items have similar visual weight

**New Implementation:**

-   Display treatment name prominently (larger, bolder font)
-   Display service name in badge (keep existing styling)
-   Remove diagnosis/description display completely
-   Remove file icon and diagnosis row

**Visual Structure:**

```
Treatment Name (prominent)
[Service Badge]
```

**Styling Approach:**

-   Treatment name: Increase font size to `text-base` or `text-lg`, use `font-bold`
-   Service name: Keep existing badge styling
-   Remove the entire diagnosis section (FileText icon + text)

### Cost Column Enhancement

**Current Implementation:**

-   Fixed width with `px-4 py-4` padding
-   Displays cost in a badge
-   Shows service cost breakdown when applicable

**New Implementation:**

-   Increase column width using `min-w-[140px]` or similar
-   Keep all existing content and styling
-   Ensure adequate spacing for cost values

**Styling Approach:**

-   Add minimum width constraint to TableCell
-   Maintain existing badge and text styling
-   Ensure proper alignment of cost breakdown text

### Date Column Enhancement

**Current Implementation:**

-   Fixed width with `px-4 py-4` padding
-   Displays date in a badge
-   Shows duration with clock icon when applicable

**New Implementation:**

-   Increase column width using `min-w-[160px]` or similar
-   Keep all existing content and styling
-   Ensure adequate spacing for date and duration

**Styling Approach:**

-   Add minimum width constraint to TableCell
-   Maintain existing badge and text styling
-   Ensure proper alignment of duration text

## Data Models

### Patient Model Fields Used

From `app/Models/Patient.php`, the following fields are relevant:

-   `full_name` (computed attribute): Combination of first_name and last_name
-   `phone_number`: Patient's contact number
-   `email`: Patient's email address

### Treatment Model Fields Used

The treatment object includes:

-   `name`: Treatment name
-   `service.name`: Associated service name
-   `diagnosis`: Treatment diagnosis (will be hidden)
-   `cost`: Base service cost
-   `total_cost`: Total cost including inventory items
-   `start_date`: Treatment start date
-   `estimated_duration_minutes`: Duration in minutes

## Error Handling

### Missing Data Scenarios

1. **Missing Contact Number:**

    - Display placeholder text: "No contact"
    - Style: Gray italic text similar to existing "No diagnosis" pattern

2. **Missing Email:**

    - The existing code already handles this with conditional rendering
    - Keep the existing pattern: only show email badge if email exists

3. **Missing Treatment Name:**

    - Existing fallback already in place: "No treatment name"
    - No changes needed

4. **Missing Service Name:**
    - Existing conditional rendering already handles this
    - No changes needed

## Testing Strategy

### Visual Testing

1. **Patient Column:**

    - Verify ID badge is removed
    - Verify contact number is displayed with appropriate styling
    - Verify email is still displayed
    - Test with patients having no contact number
    - Test with patients having no email

2. **Treatment Column:**

    - Verify diagnosis is removed
    - Verify treatment name is prominent
    - Verify service name badge is displayed
    - Test with treatments having no name
    - Test with treatments having no service

3. **Cost Column:**

    - Verify column width is adequate
    - Verify cost values are not truncated
    - Test with various cost values (small and large numbers)
    - Verify cost breakdown is still visible when applicable

4. **Date Column:**
    - Verify column width is adequate
    - Verify dates are not truncated
    - Test with various date formats
    - Verify duration display is still visible when applicable

### Responsive Testing

-   Test table display on different screen sizes
-   Verify horizontal scrolling works properly if needed
-   Ensure column widths don't break mobile layout

### Browser Compatibility

-   Test in Chrome, Firefox, Safari, and Edge
-   Verify styling consistency across browsers
-   Check for any layout issues

## Implementation Notes

### Code Changes Required

1. **Patient Column (TableCell):**

    - Remove the ID badge span element
    - Add contact number display with phone icon
    - Keep email badge with conditional rendering

2. **Treatment Column (TableCell):**

    - Increase font size and weight of treatment name
    - Remove the entire diagnosis section (div with FileText icon)
    - Keep service name badge

3. **Cost Column (TableCell):**

    - Add `min-w-[140px]` or `w-[140px]` class to TableCell

4. **Date Column (TableCell):**
    - Add `min-w-[160px]` or `w-[160px]` class to TableCell

### Styling Consistency

-   Use existing Tailwind CSS classes for consistency
-   Follow the existing color scheme (blue for info, gray for neutral)
-   Maintain the existing badge and icon patterns
-   Use lucide-react icons (Phone icon for contact number)

### Performance Considerations

-   No performance impact expected (purely presentational changes)
-   No additional data fetching required
-   No new component dependencies needed
