# Implementation Plan

-   [x] 1. Update Patient Column Display

    -   Modify the Patient TableCell component to remove the ID badge and add contact number display
    -   Import the Phone icon from lucide-react if not already imported
    -   Remove the span element displaying `ID: {treatment.id}`
    -   Add contact number display with Phone icon, styled consistently with email badge
    -   Add conditional rendering for missing contact numbers with placeholder text
    -   Ensure email badge remains visible with existing styling
    -   _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

-   [x] 2. Update Treatment Column Display

    -   Modify the Treatment TableCell component to make treatment name prominent and remove diagnosis
    -   Increase treatment name font size to `text-base` or `text-lg` and apply `font-bold` class
    -   Remove the stethoscope icon from treatment name row
    -   Keep the service name badge with existing styling
    -   Remove the entire diagnosis section (div containing FileText icon and diagnosis text)
    -   _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

-   [x] 3. Widen Cost and Date Columns

    -   Add minimum width constraints to Cost and Date TableCell components
    -   Add `min-w-[140px]` class to the Cost column TableCell
    -   Add `min-w-[160px]` class to the Date column TableCell
    -   Verify that existing content (cost breakdown and duration) displays properly with new widths
    -   _Requirements: 3.1, 3.2, 3.3, 3.4_

-   [x] 4. Visual Testing and Verification
    -   Test the table display with various data scenarios
    -   Verify Patient column displays name, contact, and email correctly
    -   Verify Patient column handles missing contact numbers gracefully
    -   Verify Treatment column shows prominent treatment name and service badge
    -   Verify Treatment column no longer shows diagnosis
    -   Verify Cost column width accommodates all cost values
    -   Verify Date column width accommodates dates and duration
    -   Test responsive behavior on different screen sizes
    -   _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4_
