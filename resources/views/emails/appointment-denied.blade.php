<x-mail::message>
# Appointment Request Denied

Dear {{ $patient->full_name ?? $patient->first_name }},

We regret to inform you that your appointment request at {{ $appointment->clinic->name }} for {{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('F j, Y \a\t g:i A') }} was not approved.

@if($reason)
**Reason:** {{ $reason }}
@endif

If you have questions or would like to rebook, please contact us or try booking another slot.

Thank you for your understanding.

Best regards,<br>
{{ $appointment->clinic->name }} Team
</x-mail::message>
