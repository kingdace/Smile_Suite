import ApplicationLogo from "@/Components/ApplicationLogo";

export default function ClinicLogo({ clinic, className, ...props }) {
    // If clinic has a logo, display it
    if (clinic?.logo_url) {
        return (
            <img
                src={clinic.logo_url}
                alt={`${clinic.name} Logo`}
                className={className || "h-9 w-auto"}
                {...props}
            />
        );
    }

    // Otherwise, show the default application logo
    return <ApplicationLogo className={className} {...props} />;
}
