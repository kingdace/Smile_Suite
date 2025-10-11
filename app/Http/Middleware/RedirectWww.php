<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectWww
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only redirect in production environment
        if (app()->environment('production')) {
            $host = $request->getHost();
            
            // Check if the request is coming from www subdomain
            if (str_starts_with($host, 'www.')) {
                // Get the domain without www
                $domain = substr($host, 4); // Remove 'www.' prefix
                
                // Build the redirect URL with HTTPS
                $redirectUrl = 'https://' . $domain . $request->getRequestUri();
                
                // Perform 301 redirect
                return redirect($redirectUrl, 301);
            }
        }

        return $next($request);
    }
}