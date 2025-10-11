import ApplicationLogo from "@/Components/ApplicationLogo";
import { ImageHelper } from "@/Helpers/ImageHelper.js";

export default function ClinicLogo({ clinic, className, ...props }) {
    // If clinic has a logo, display it
    if (clinic?.logo_url) {
        return (
            <img
                src={ImageHelper.getImageUrl(
                    clinic.logo_url,
                    "/images/clinic-logo.png"
                )}
                alt={`${clinic.name} Logo`}
                className={`object-contain ${className || "h-9 w-auto"}`}
                style={{ minWidth: "36px", minHeight: "36px" }}
                onError={(e) => {
                    e.target.src = "/images/clinic-logo.png";
                }}
                {...props}
            />
        );
    }

    // Otherwise, show the default application logo
    return <ApplicationLogo className={className} {...props} />;
}
