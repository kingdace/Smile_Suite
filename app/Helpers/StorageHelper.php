<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Get the appropriate disk based on environment
     */
    public static function getDisk(): string
    {
        return app()->environment('production') ? 's3' : 'public';
    }

    /**
     * Store a file and return the URL
     */
    public static function storeAndGetUrl($file, string $path): string
    {
        $disk = self::getDisk();
        $storedPath = $file->store($path, $disk);
        return Storage::disk($disk)->url($storedPath);
    }

    /**
     * Store a file with custom filename and return the URL
     */
    public static function storeAsAndGetUrl($file, string $path, string $name): string
    {
        $disk = self::getDisk();
        $storedPath = $file->storeAs($path, $name, $disk);
        return Storage::disk($disk)->url($storedPath);
    }

    /**
     * Delete a file from storage
     */
    public static function deleteFile(string $url): bool
    {
        $disk = self::getDisk();

        if ($disk === 's3' && str_starts_with($url, 'https://')) {
            // Extract path from S3 URL
            $parsedUrl = parse_url($url);
            $filePath = ltrim($parsedUrl['path'] ?? '', '/');
            return Storage::disk('s3')->delete($filePath);
        } elseif ($disk === 'public' && str_starts_with($url, '/storage/')) {
            $filePath = str_replace('/storage/', '', $url);
            return Storage::disk('public')->delete($filePath);
        }

        return false;
    }

    /**
     * Check if file exists (only for local development)
     */
    public static function fileExists(string $url): bool
    {
        $disk = self::getDisk();

        if ($disk === 'public' && str_starts_with($url, '/storage/')) {
            return file_exists(public_path($url));
        }

        // For S3, we assume the file exists if URL is valid
        return !empty($url);
    }
}
