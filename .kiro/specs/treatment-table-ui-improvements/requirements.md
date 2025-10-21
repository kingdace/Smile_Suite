# Requirements Document

## Introduction

This feature improves the UI display of the Treatment Management table by refining the information shown in the Patient, Treatment, Cost, and Date columns to enhance readability and reduce visual clutter.

## Glossary

-   **Treatment Table**: The data table displayed on the Treatment Management index page that lists all treatments for a clinic
-   **Patient Column**: The table column that displays patient information
-   **Treatment Column**: The table column that displays treatment details
-   **Cost Column**: The table column that displays treatment cost information
-   **Date Column**: The table column that displays treatment date information
-   **Contact Number**: The patient's phone number stored in the `phone_number` field

## Requirements

### Requirement 1

**User Story:** As a clinic staff member, I want to see only essential patient information in the Patient column, so that the table is less cluttered and easier to scan

#### Acceptance Criteria

1. WHEN the Treatment Table is rendered, THE Patient Column SHALL display the patient's full name
2. WHEN the Treatment Table is rendered, THE Patient Column SHALL display the patient's contact number
3. WHEN the Treatment Table is rendered, THE Patient Column SHALL display the patient's email address
4. WHEN the Treatment Table is rendered, THE Patient Column SHALL NOT display the patient ID number
5. WHERE a patient has no contact number, THE Patient Column SHALL display a placeholder text indicating no contact number is available

### Requirement 2

**User Story:** As a clinic staff member, I want to see only the treatment name and service name in the Treatment column, so that I can quickly identify treatments without being distracted by lengthy descriptions

#### Acceptance Criteria

1. WHEN the Treatment Table is rendered, THE Treatment Column SHALL display the treatment name prominently
2. WHEN the Treatment Table is rendered, THE Treatment Column SHALL display the service name
3. WHEN the Treatment Table is rendered, THE Treatment Column SHALL NOT display the treatment description
4. WHEN the Treatment Table is rendered, THE Treatment Column SHALL NOT display the diagnosis information
5. WHEN the Treatment Table is rendered, THE Treatment Column SHALL apply visual styling to make the treatment name more prominent than the service name

### Requirement 3

**User Story:** As a clinic staff member, I want the Cost and Date columns to be wider, so that their contents are fully visible without truncation

#### Acceptance Criteria

1. WHEN the Treatment Table is rendered, THE Cost Column SHALL have sufficient width to display cost values without truncation
2. WHEN the Treatment Table is rendered, THE Date Column SHALL have sufficient width to display date values without truncation
3. WHEN the Treatment Table is rendered, THE Cost Column SHALL display all cost information including service cost breakdown when applicable
4. WHEN the Treatment Table is rendered, THE Date Column SHALL display the date and duration information when applicable
