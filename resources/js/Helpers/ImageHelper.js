/**
 * Image Helper for handling image URLs with fallbacks
 */
export class ImageHelper {
    /**
     * Get image URL with fallback for missing images
     */
    static getImageUrl(imageUrl, fallback = null) {
        // If it's already a full URL (external), return as is
        if (
            imageUrl &&
            (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
        ) {
            return imageUrl;
        }

        // If it's a storage path, return as is (Laravel will handle the symlink)
        if (imageUrl && imageUrl.startsWith("/storage/")) {
            return imageUrl;
        }

        // If it's a relative path, ensure it starts with /
        if (imageUrl && !imageUrl.startsWith("/")) {
            return `/${imageUrl}`;
        }

        // Return fallback image or placeholder
        return fallback || "/images/placeholder-image.svg";
    }

    /**
     * Get clinic gallery image with fallback
     */
    static getClinicGalleryImage(imageUrl) {
        return this.getImageUrl(imageUrl, "/images/clinic-placeholder.svg");
    }

    /**
     * Get treatment image with fallback
     */
    static getTreatmentImage(imageUrl) {
        return this.getImageUrl(imageUrl, "/images/treatment-placeholder.svg");
    }
}
