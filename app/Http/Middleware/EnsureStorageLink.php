<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStorageLink
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only check in production and only for storage-related requests
        if (app()->environment('production') && 
            (str_contains($request->path(), 'storage') || str_contains($request->path(), 'clinic'))) {
            
            $storagePath = public_path('storage');
            $targetPath = storage_path('app/public');
            
            // Check if storage symlink exists and is valid
            if (!is_link($storagePath) || !file_exists($storagePath)) {
                // Remove broken symlink if it exists
                if (is_link($storagePath)) {
                    unlink($storagePath);
                }
                
                // Create the symlink
                if (is_dir($targetPath)) {
                    symlink($targetPath, $storagePath);
                }
            }
        }

        return $next($request);
    }
}
