<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PsgcApiController extends Controller
{
    private $baseUrl = 'https://psgc.gitlab.io/api';

    public function __construct()
    {
        // Add CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    public function getRegions()
    {
        try {
            Log::info('Fetching regions from PSGC API');

            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ]
                ])
                ->get("{$this->baseUrl}/regions.json");

            Log::info('API Response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if (!$response->successful()) {
                Log::error('Failed to fetch regions', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'Failed to fetch regions: ' . $response->body()], 500);
            }

            $data = $response->json();
            Log::info('Regions fetched successfully', ['count' => count($data)]);
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Exception in getRegions', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function getProvinces(Request $request)
    {
        try {
            $regionId = $request->query('regionId');
            if (!$regionId) {
                return response()->json(['error' => 'Region ID is required'], 400);
            }

            Log::info('Fetching provinces for region', ['regionId' => $regionId]);
            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ]
                ])
                ->get("{$this->baseUrl}/regions/{$regionId}/provinces.json");

            Log::info('API Response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if (!$response->successful()) {
                Log::error('Failed to fetch provinces', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'Failed to fetch provinces: ' . $response->body()], 500);
            }

            $data = $response->json();
            Log::info('Provinces fetched successfully', ['count' => count($data)]);
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Exception in getProvinces', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function getCities(Request $request)
    {
        try {
            $provinceId = $request->query('provinceId');
            if (!$provinceId) {
                return response()->json(['error' => 'Province ID is required'], 400);
            }

            Log::info('Fetching cities for province', ['provinceId' => $provinceId]);
            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ]
                ])
                ->get("{$this->baseUrl}/provinces/{$provinceId}/cities.json");

            Log::info('API Response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if (!$response->successful()) {
                Log::error('Failed to fetch cities', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'Failed to fetch cities: ' . $response->body()], 500);
            }

            $data = $response->json();
            Log::info('Cities fetched successfully', ['count' => count($data)]);
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Exception in getCities', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function getMunicipalities(Request $request)
    {
        try {
            $provinceId = $request->query('provinceId');
            if (!$provinceId) {
                return response()->json(['error' => 'Province ID is required'], 400);
            }

            Log::info('Fetching municipalities for province', ['provinceId' => $provinceId]);
            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ]
                ])
                ->get("{$this->baseUrl}/provinces/{$provinceId}/municipalities.json");

            Log::info('API Response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if (!$response->successful()) {
                Log::error('Failed to fetch municipalities', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'Failed to fetch municipalities: ' . $response->body()], 500);
            }

            $data = $response->json();
            Log::info('Municipalities fetched successfully', ['count' => count($data)]);
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Exception in getMunicipalities', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }

    public function getBarangays(Request $request)
    {
        try {
            $cityId = $request->query('cityId');
            $municipalityId = $request->query('municipalityId');

            if (!$cityId && !$municipalityId) {
                return response()->json(['error' => 'City ID or Municipality ID is required'], 400);
            }

            Log::info('Fetching barangays', [
                'cityId' => $cityId,
                'municipalityId' => $municipalityId
            ]);

            $endpoint = $cityId
                ? "{$this->baseUrl}/cities/{$cityId}/barangays.json"
                : "{$this->baseUrl}/municipalities/{$municipalityId}/barangays.json";

            $response = Http::timeout(30)
                ->withOptions([
                    'verify' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ]
                ])
                ->get($endpoint);

            Log::info('API Response', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body' => $response->body()
            ]);

            if (!$response->successful()) {
                Log::error('Failed to fetch barangays', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'Failed to fetch barangays: ' . $response->body()], 500);
            }

            $data = $response->json();
            Log::info('Barangays fetched successfully', ['count' => count($data)]);
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Exception in getBarangays', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }
}
