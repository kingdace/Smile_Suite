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
        try {
            $disk = self::getDisk();
            \Log::info('StorageHelper: Uploading file', [
                'disk' => $disk,
                'path' => $path,
                'original_name' => $file->getClientOriginalName()
            ]);

            if ($disk === 's3') {
                // Store with public visibility
                $storedPath = $file->store($path, ['disk' => $disk, 'visibility' => 'public']);
            } else {
                $storedPath = $file->store($path, $disk);
            }

            // Check if upload succeeded
            if (!$storedPath) {
                throw new \Exception('File upload failed - store() returned false');
            }

            \Log::info('StorageHelper: File stored', ['stored_path' => $storedPath]);

            /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
            $storage = Storage::disk($disk);
            $url = $storage->url($storedPath);

            \Log::info('StorageHelper: File uploaded successfully', ['url' => $url]);
            return $url;
        } catch (\Exception $e) {
            \Log::error('StorageHelper: Upload failed', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Store a file with custom filename and return the URL
     */
    public static function storeAsAndGetUrl($file, string $path, string $name): string
    {
        $disk = self::getDisk();
        if ($disk === 's3') {
            // Ensure public object when on S3
            $storedPath = $file->storeAs($path, $name, $disk);
            Storage::disk($disk)->setVisibility($storedPath, 'public');
        } else {
            $storedPath = $file->storeAs($path, $name, $disk);
        }
        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($disk);
        return $storage->url($storedPath);
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
