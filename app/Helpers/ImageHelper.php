<?php

namespace App\Helpers;

class ImageHelper
{
    /**
     * Get image URL with fallback for missing images
     */
    public static function getImageUrl($imageUrl, $fallback = null)
    {
        // If it's already a full URL (external), return as is
        if (filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            return $imageUrl;
        }

        // If it's a storage path, check if file exists
        if (str_starts_with($imageUrl, '/storage/')) {
            $filePath = public_path($imageUrl);
            if (file_exists($filePath)) {
                return $imageUrl;
            }
        }

        // Return fallback image or placeholder
        return $fallback ?? '/images/placeholder-image.svg';
    }

    /**
     * Get clinic gallery image with fallback
     */
    public static function getClinicGalleryImage($imageUrl)
    {
        return self::getImageUrl($imageUrl, '/images/clinic-placeholder.svg');
    }

    /**
     * Get treatment image with fallback
     */
    public static function getTreatmentImage($imageUrl)
    {
        return self::getImageUrl($imageUrl, '/images/treatment-placeholder.svg');
    }
}
