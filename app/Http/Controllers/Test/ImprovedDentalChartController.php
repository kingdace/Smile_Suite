<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImprovedDentalChartController extends Controller
{
    public function index()
    {
        return Inertia::render('Test/ImprovedDentalChart', [
            'auth' => [
                'user' => auth()->user() ? auth()->user() : null,
            ],
        ]);
    }
}
