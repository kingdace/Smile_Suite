<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ExcelExport;
use Carbon\Carbon;

trait ExportTrait
{
    /**
     * Export data to CSV or Excel format
     *
     * @param Builder $query The query builder instance
     * @param string $filename Base filename without extension
     * @param array $headers Array of column headers
     * @param string $format Export format ('csv' or 'excel')
     * @param callable|null $dataMapper Optional data mapping function
     * @param int|null $clinicId Clinic ID for filename generation
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportData(
        Builder $query,
        string $filename,
        array $headers,
        string $format = 'csv',
        callable $dataMapper = null,
        int $clinicId = null
    ) {
        try {
            // Get the data
            $data = $query->get();

            // Generate filename with clinic ID and timestamp
            $generatedFilename = $this->generateFilename($filename, $format, $clinicId);

            // Determine format from request or parameter
            $exportFormat = $this->detectFormat($format);

            if ($exportFormat === 'excel') {
                return $this->exportToExcel($data, $generatedFilename, $headers, $dataMapper);
            } else {
                return $this->exportToCsv($data, $generatedFilename, $headers, $dataMapper);
            }
        } catch (\Exception $e) {
            return $this->handleExportError($e);
        }
    }

    /**
     * Export data to CSV format using existing fputcsv approach for backward compatibility
     *
     * @param \Illuminate\Support\Collection $data
     * @param string $filename
     * @param array $headers
     * @param callable|null $dataMapper
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    protected function exportToCsv($data, string $filename, array $headers, callable $dataMapper = null)
    {
        $responseHeaders = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($data, $headers, $dataMapper) {
            $file = fopen('php://output', 'w');

            // Write CSV headers
            fputcsv($file, $headers);

            // Write data rows
            foreach ($data as $item) {
                if ($dataMapper) {
                    $row = $dataMapper($item);
                } else {
                    $row = $this->defaultDataMapper($item, $headers);
                }
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $responseHeaders);
    }

    /**
     * Export data to Excel format using maatwebsite/excel package
     *
     * @param \Illuminate\Support\Collection $data
     * @param string $filename
     * @param array $headers
     * @param callable|null $dataMapper
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToExcel($data, string $filename, array $headers, callable $dataMapper = null)
    {
        return Excel::download(new ExcelExport($data, $headers, $dataMapper), $filename);
    }

    /**
     * Generate filename with clinic ID and timestamp following PaymentController pattern
     *
     * @param string $baseFilename
     * @param string $format
     * @param int|null $clinicId
     * @return string
     */
    protected function generateFilename(string $baseFilename, string $format, int $clinicId = null): string
    {
        $extension = $format === 'excel' ? 'xlsx' : 'csv';
        $timestamp = now()->format('Y-m-d_H-i-s');
        
        if ($clinicId) {
            return "{$baseFilename}_{$clinicId}_{$timestamp}.{$extension}";
        }
        
        return "{$baseFilename}_{$timestamp}.{$extension}";
    }

    /**
     * Detect export format from request parameters or file extension
     *
     * @param string $defaultFormat
     * @return string
     */
    protected function detectFormat(string $defaultFormat = 'csv'): string
    {
        if (request()->has('format')) {
            $requestFormat = strtolower(request()->get('format'));
            return in_array($requestFormat, ['csv', 'excel', 'xlsx']) ? 
                   ($requestFormat === 'xlsx' ? 'excel' : $requestFormat) : 
                   $defaultFormat;
        }

        return $defaultFormat;
    }

    /**
     * Default data mapper for basic field extraction
     *
     * @param mixed $item
     * @param array $headers
     * @return array
     */
    protected function defaultDataMapper($item, array $headers): array
    {
        $row = [];
        
        foreach ($headers as $header) {
            $key = strtolower(str_replace(' ', '_', $header));
            
            // Handle common field mappings
            switch ($key) {
                case 'id':
                    $row[] = $item->id ?? 'N/A';
                    break;
                case 'reference_number':
                    $row[] = $item->reference_number ?? 'N/A';
                    break;
                case 'patient_name':
                    $row[] = $item->patient ? 
                            trim($item->patient->first_name . ' ' . $item->patient->last_name) : 
                            'N/A';
                    break;
                case 'treatment':
                    $row[] = $item->treatment ? $item->treatment->name : 'N/A';
                    break;
                case 'amount':
                    $row[] = $item->amount ?? 'N/A';
                    break;
                case 'payment_method':
                    $row[] = $item->payment_method ?? 'N/A';
                    break;
                case 'status':
                    $row[] = $item->status ?? 'N/A';
                    break;
                case 'category':
                    $row[] = $item->category ?? 'N/A';
                    break;
                case 'payment_date':
                    $row[] = $item->payment_date ? 
                            Carbon::parse($item->payment_date)->format('Y-m-d') : 
                            'N/A';
                    break;
                case 'notes':
                    $row[] = $item->notes ?? 'N/A';
                    break;
                default:
                    // Try to get the field directly
                    $row[] = $item->{$key} ?? 'N/A';
                    break;
            }
        }
        
        return $row;
    }

    /**
     * Handle export errors gracefully
     *
     * @param \Exception $e
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleExportError(\Exception $e): \Illuminate\Http\JsonResponse
    {
        \Illuminate\Support\Facades\Log::error('Export failed: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Export failed. Please try again.',
            'message' => config('app.debug') ? $e->getMessage() : 'An error occurred during export.'
        ], 500);
    }

    /**
     * Apply common filters to query based on request parameters
     *
     * @param Builder $query
     * @param Request $request
     * @return Builder
     */
    protected function applyExportFilters(Builder $query, Request $request): Builder
    {
        // Date range filters
        if ($request->date_from && $request->date_to) {
            $query->whereBetween('payment_date', [$request->date_from, $request->date_to]);
        } elseif ($request->date_from) {
            $query->where('payment_date', '>=', $request->date_from);
        } elseif ($request->date_to) {
            $query->where('payment_date', '<=', $request->date_to);
        }

        // Status filter
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Payment method filter
        if ($request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        // Category filter
        if ($request->category) {
            $query->where('category', $request->category);
        }

        // Patient filter
        if ($request->patient_id) {
            $query->where('patient_id', $request->patient_id);
        }

        // Treatment filter
        if ($request->treatment_id) {
            $query->where('treatment_id', $request->treatment_id);
        }

        // Amount range filters
        if ($request->amount_min) {
            $query->where('amount', '>=', $request->amount_min);
        }

        if ($request->amount_max) {
            $query->where('amount', '<=', $request->amount_max);
        }

        // Search filter
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('reference_number', 'like', "%{$request->search}%")
                    ->orWhere('notes', 'like', "%{$request->search}%")
                    ->orWhere('transaction_id', 'like', "%{$request->search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($request) {
                        $patientQuery->where('first_name', 'like', "%{$request->search}%")
                                    ->orWhere('last_name', 'like', "%{$request->search}%");
                    })
                    ->orWhereHas('treatment', function ($treatmentQuery) use ($request) {
                        $treatmentQuery->where('name', 'like', "%{$request->search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * Get payment export headers
     */
    protected function getPaymentExportHeaders(): array
    {
        return [
            'ID',
            'Reference Number',
            'Patient Name',
            'Treatment',
            'Amount',
            'Payment Method',
            'Status',
            'Category',
            'Payment Date',
            'Notes'
        ];
    }

    /**
     * Payment-specific data mapper
     *
     * @param mixed $payment
     * @return array
     */
    protected function mapPaymentData($payment): array
    {
        return [
            $payment->id,
            $payment->reference_number,
            $payment->patient ? 
                trim($payment->patient->first_name . ' ' . $payment->patient->last_name) : 
                'N/A',
            $payment->treatment ? $payment->treatment->name : 'N/A',
            $payment->amount,
            $payment->payment_method,
            $payment->status,
            $payment->category,
            $payment->payment_date ? 
                Carbon::parse($payment->payment_date)->format('Y-m-d') : 
                'N/A',
            $payment->notes,
        ];
    }
}
