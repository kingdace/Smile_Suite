<x-mail::message>
# Appointment Confirmed!

Dear {{ $patient->full_name ?? $patient->first_name }},

Your appointment at {{ $appointment->clinic->name }} has been approved.

**Date & Time:** {{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('F j, Y \a\t g:i A') }}

@if($dentist)
**Assigned Dentist:** {{ $dentist->name }}
@endif

We look forward to seeing you!

If you have any questions or need to reschedule, please contact us.

Thanks,<br>
{{ $appointment->clinic->name }} Team
</x-mail::message>
