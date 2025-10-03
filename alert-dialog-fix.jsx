// Fix for AlertDialog accessibility issues
// Add this to your AlertDialog components

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Example of how to fix AlertDialog components:

// BEFORE (causing warnings):
<AlertDialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
    {/* Content without proper accessibility */}
</AlertDialogContent>

// AFTER (accessibility compliant):
<AlertDialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
    <AlertDialogTitle className="sr-only">
        Approve Registration
    </AlertDialogTitle>
    <AlertDialogDescription className="sr-only">
        Confirm approval of clinic registration request
    </AlertDialogDescription>

    {/* Your existing content */}
</AlertDialogContent>

// OR if you want to hide the title visually but keep it for screen readers:
<AlertDialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
    <VisuallyHidden>
        <AlertDialogTitle>Approve Registration</AlertDialogTitle>
    </VisuallyHidden>
    <VisuallyHidden>
        <AlertDialogDescription>Confirm approval of clinic registration request</AlertDialogDescription>
    </VisuallyHidden>

    {/* Your existing content */}
</AlertDialogContent>
