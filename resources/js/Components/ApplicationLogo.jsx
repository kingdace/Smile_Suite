export default function ApplicationLogo(props) {
    return (
        <img
            src="/images/smile-suite-logo.png"
            alt="Smile Suite Logo"
            className={`object-contain ${props.className || "h-16 w-16"}`}
            style={{
                minWidth: "64px",
                minHeight: "64px",
                maxWidth: "80px",
                maxHeight: "80px",
            }}
            {...props}
        />
    );
}
