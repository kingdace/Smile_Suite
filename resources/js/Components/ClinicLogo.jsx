import ApplicationLogo from "@/Components/ApplicationLogo";

export default function ClinicLogo({ clinic, className, ...props }) {
    // If clinic has a logo, display it
    if (clinic?.logo_url) {
        return (
            <img
                src={clinic.logo_url}
                alt={`${clinic.name} Logo`}
                className={`object-contain ${className || "h-9 w-auto"}`}
                style={{ minWidth: "36px", minHeight: "36px" }}
                {...props}
            />
        );
    }

    // Otherwise, show the default application logo
    return <ApplicationLogo className={className} {...props} />;
}
