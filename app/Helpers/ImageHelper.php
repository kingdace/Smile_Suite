<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

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
            // First check if the symlink exists and file is accessible via public path
            $publicPath = public_path($imageUrl);
            if (file_exists($publicPath)) {
                return $imageUrl;
            }

            // If public path doesn't exist, check if file exists in storage and try to get URL
            $storagePath = str_replace('/storage/', '', $imageUrl);
            if (Storage::disk('public')->exists($storagePath)) {
                // Try to get the storage URL
                $storageUrl = Storage::disk('public')->url($storagePath);
                if ($storageUrl) {
                    return $storageUrl;
                }
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
