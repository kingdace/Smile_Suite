// Helper for avatar initials
export function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

// Helper for avatar colors
export function getAvatarColor(name) {
    const colors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-orange-50",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-red-500",
        "bg-teal-50",
    ];
    if (!name) return colors[0];
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[code % colors.length];
}

// Helper for copying text to clipboard
export function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied!");
    });
}

// Helper for getting user location
export function getUserLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
        onError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            onSuccess([latitude, longitude]);
        },
        () => {
            onError("Unable to retrieve your location.");
        }
    );
}
