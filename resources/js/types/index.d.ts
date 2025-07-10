declare module "@inertiajs/core" {
    interface PageProps extends InertiaProps, App.SharedProps {}
}

declare namespace App {
    interface Models {
        User: {
            id: number;
            name: string;
            email: string;
            email_verified_at: string;
            created_at: string;
            updated_at: string;
            clinic_id: number | null;
            role: "admin" | "clinic" | "dentist" | "staff";
        };
        Clinic: {
            id: number;
            name: string;
            address: string;
            phone: string;
            email: string;
            website: string | null;
            created_at: string;
            updated_at: string;
        };
        Patient: {
            id: number;
            user_id: number;
            clinic_id: number;
            date_of_birth: string;
            gender: string;
            phone: string;
            address: string;
            medical_history: string | null;
            created_at: string;
            updated_at: string;
            user: App.Models.User;
        };
        Treatment: {
            id: number;
            clinic_id: number;
            patient_id: number;
            appointment_id: number | null;
            user_id: number; // Dentist
            name: string;
            description: string;
            cost: string;
            status: "scheduled" | "in_progress" | "completed" | "cancelled";
            start_date: string;
            end_date: string | null;
            notes: string | null;
            created_at: string;
            updated_at: string;
            patient: App.Models.Patient;
            dentist: App.Models.User;
            appointment: App.Models.Appointment | null;
        };
        Appointment: {
            id: number;
            clinic_id: number;
            patient_id: number;
            dentist_id: number;
            title: string;
            description: string | null;
            date: string;
            start_time: string;
            end_time: string;
            status: "scheduled" | "confirmed" | "completed" | "cancelled";
            notes: string | null;
            created_at: string;
            updated_at: string;
            patient: App.Models.Patient;
            dentist: App.Models.User;
        };
    }

    interface SharedProps {
        auth: {
            user: App.Models.User;
            clinic_id?: number;
            clinic?: App.Models.Clinic;
        };
        flash: {
            message: string;
            success: string;
            error: string;
        };
        ziggy: {
            url: string;
            port: string | null;
            host: string;
            defaults: object;
            routes: object;
        };
    }
}
