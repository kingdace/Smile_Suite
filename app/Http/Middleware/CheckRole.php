<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== $role) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Insufficient permissions'], 403);
            }

            // Store intended URL for redirect after permission modal
            session(['intended_url' => $request->url()]);
            return redirect()->route('permission.denied', ['permission' => $role]);
        }

        return $next($request);
    }
}
