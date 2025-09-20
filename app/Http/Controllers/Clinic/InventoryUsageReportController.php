<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\TreatmentInventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class InventoryUsageReportController extends Controller
{
    use SubscriptionAccessControl;

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('subscription.access');
    }

    public function index(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $filters = $request->only(['start_date', 'end_date', 'category', 'inventory_id']);

        $query = TreatmentInventoryItem::query()
            ->join('treatments', 'treatment_inventory_items.treatment_id', '=', 'treatments.id')
            ->join('inventory', 'treatment_inventory_items.inventory_id', '=', 'inventory.id')
            ->where('treatments.clinic_id', $clinic->id)
            ->where('treatments.status', 'completed');

        // Apply date filters
        if ($filters['start_date']) {
            $query->whereDate('treatments.updated_at', '>=', $filters['start_date']);
        }
        if ($filters['end_date']) {
            $query->whereDate('treatments.updated_at', '<=', $filters['end_date']);
        }

        // Apply category filter
        if ($filters['category']) {
            $query->where('inventory.category', $filters['category']);
        }

        // Apply specific inventory filter
        if ($filters['inventory_id']) {
            $query->where('inventory.id', $filters['inventory_id']);
        }

        // Get aggregated data
        $inventoryUsage = $query
            ->select([
                'inventory.id',
                'inventory.name',
                'inventory.category',
                'inventory.quantity as current_stock',
                'inventory.minimum_quantity',
                'inventory.unit_price',
                DB::raw('SUM(treatment_inventory_items.quantity_used) as total_quantity_used'),
                DB::raw('SUM(treatment_inventory_items.total_cost) as total_value'),
                DB::raw('COUNT(DISTINCT treatment_inventory_items.treatment_id) as treatments_count')
            ])
            ->groupBy([
                'inventory.id',
                'inventory.name',
                'inventory.category',
                'inventory.quantity',
                'inventory.minimum_quantity',
                'inventory.unit_price'
            ])
            ->orderBy('total_quantity_used', 'desc')
            ->get();

        return Inertia::render('Clinic/Reports/InventoryUsage', [
            'inventoryUsage' => $inventoryUsage,
            'filters' => $filters
        ]);
    }

    public function export(Request $request)
    {
        $clinic = Auth::user()->clinic;

        $filters = $request->only(['start_date', 'end_date', 'category', 'inventory_id']);

        $query = TreatmentInventoryItem::query()
            ->join('treatments', 'treatment_inventory_items.treatment_id', '=', 'treatments.id')
            ->join('inventory', 'treatment_inventory_items.inventory_id', '=', 'inventory.id')
            ->where('treatments.clinic_id', $clinic->id)
            ->where('treatments.status', 'completed');

        // Apply filters (same as index method)
        if ($filters['start_date']) {
            $query->whereDate('treatments.updated_at', '>=', $filters['start_date']);
        }
        if ($filters['end_date']) {
            $query->whereDate('treatments.updated_at', '<=', $filters['end_date']);
        }
        if ($filters['category']) {
            $query->where('inventory.category', $filters['category']);
        }
        if ($filters['inventory_id']) {
            $query->where('inventory.id', $filters['inventory_id']);
        }

        $inventoryUsage = $query
            ->select([
                'inventory.id',
                'inventory.name',
                'inventory.category',
                'inventory.quantity as current_stock',
                'inventory.minimum_quantity',
                'inventory.unit_price',
                DB::raw('SUM(treatment_inventory_items.quantity_used) as total_quantity_used'),
                DB::raw('SUM(treatment_inventory_items.total_cost) as total_value'),
                DB::raw('COUNT(DISTINCT treatment_inventory_items.treatment_id) as treatments_count')
            ])
            ->groupBy([
                'inventory.id',
                'inventory.name',
                'inventory.category',
                'inventory.quantity',
                'inventory.minimum_quantity',
                'inventory.unit_price'
            ])
            ->orderBy('total_quantity_used', 'desc')
            ->get();

        // Generate Excel export
        return $this->generateExcelExport($inventoryUsage, $filters);
    }

    private function generateExcelExport($data, $filters)
    {
        $filename = 'inventory_usage_report_' . date('Y-m-d_H-i-s') . '.xlsx';

        // Create a simple CSV export for now
        $csvData = [];
        $csvData[] = [
            'Item Name',
            'Category',
            'Current Stock',
            'Minimum Quantity',
            'Unit Price',
            'Total Quantity Used',
            'Total Value',
            'Treatments Count',
            'Stock Status'
        ];

        foreach ($data as $item) {
            $csvData[] = [
                $item->name,
                $item->category,
                $item->current_stock,
                $item->minimum_quantity,
                $item->unit_price,
                $item->total_quantity_used,
                $item->total_value,
                $item->treatments_count,
                $item->current_stock <= $item->minimum_quantity ? 'Low Stock' : 'In Stock'
            ];
        }

        $csvContent = '';
        foreach ($csvData as $row) {
            $csvContent .= implode(',', array_map(function($field) {
                return '"' . str_replace('"', '""', $field) . '"';
            }, $row)) . "\n";
        }

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
