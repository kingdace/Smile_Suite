<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ExcelExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, WithProperties, WithColumnFormatting
{
    private $data;
    private $headers;
    private $dataMapper;
    private $title;

    public function __construct($data, $headers, $dataMapper = null, $title = 'Report')
    {
        $this->data = $data;
        $this->headers = $headers;
        $this->dataMapper = $dataMapper;
        $this->title = $title;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return $this->headers;
    }

    public function map($row): array
    {
        if ($this->dataMapper) {
            $mappedData = ($this->dataMapper)($row);
            // Ensure all values are properly formatted for Excel with header context
            return array_map(function($value, $index) {
                $header = $this->headers[$index] ?? '';
                return $this->formatExcelValue($value, $header);
            }, $mappedData, array_keys($mappedData));
        }

        // Default mapping - extract values based on headers
        $mapped = [];
        foreach ($this->headers as $header) {
            $key = strtolower(str_replace(' ', '_', $header));
            $value = $row->{$key} ?? null;
            $mapped[] = $this->formatExcelValue($value, $header);
        }
        return $mapped;
    }

    /**
     * Format values appropriately for Excel export
     */
    private function formatExcelValue($value, $header = '')
    {
        $headerLower = strtolower($header);

        // Handle null or empty values based on column type
        if ($value === null || $value === '' || $value === 'NULL') {
            // Numeric columns should show 0
            if (in_array($headerLower, ['total appointments', 'total treatments', 'total payments (₱)', 'amount', 'quantity', 'count', 'patient id', 'age (years)'])) {
                return 0;
            }
            return ''; // Use empty string instead of N/A for cleaner export
        }

        // Handle numeric values - ensure zeros are preserved
        if (is_numeric($value)) {
            // For currency fields, return as float
            if (in_array($headerLower, ['total payments (₱)', 'total payments', 'amount', 'cost', 'price', 'revenue'])) {
                return floatval($value);
            }
            // For count fields, return as integer
            if (in_array($headerLower, ['total appointments', 'total treatments', 'quantity', 'count', 'patient id', 'age (years)'])) {
                return intval($value);
            }
            return $value;
        }

        // Handle phone numbers - ensure they're treated as text and preserve format
        if (in_array($headerLower, ['phone number', 'emergency contact phone', 'phone', 'contact', 'mobile'])) {
            if ($value === '' || $value === 'N/A') return '';
            return strval($value); // Ensure it's treated as text
        }

        // Handle currency values - remove formatting if present
        if (is_string($value) && preg_match('/^[\₱\$]?[\d,]+\.?\d*$/', $value)) {
            $numericValue = preg_replace('/[^\d.]/', '', $value);
            return floatval($numericValue);
        }

        // Handle dates - check if it's a date-only field
        if ($value instanceof \DateTime || $value instanceof \Carbon\Carbon) {
            // Date-only fields (no time)
            if (in_array($headerLower, ['date of birth', 'registration date', 'created date', 'birth date'])) {
                return $value->format('Y-m-d');
            }
            // Date-time fields
            return $value->format('Y-m-d H:i:s');
        }

        // Handle string dates - be more selective
        if (is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}/', $value)) {
            try {
                // Date-only fields (no time)
                if (in_array($headerLower, ['date of birth', 'registration date', 'created date', 'birth date'])) {
                    return \Carbon\Carbon::parse($value)->format('Y-m-d');
                }
                // Date-time fields
                return \Carbon\Carbon::parse($value)->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                return $value;
            }
        }

        // Handle N/A values consistently
        if ($value === 'N/A' || $value === 'n/a') {
            return 'N/A';
        }

        return $value;
    }

    /**
     * Convert column number to Excel column letter (A, B, C, ..., Z, AA, AB, etc.)
     */
    private function getColumnLetter($columnNumber)
    {
        $columnLetter = '';
        while ($columnNumber > 0) {
            $columnNumber--;
            $columnLetter = chr(65 + ($columnNumber % 26)) . $columnLetter;
            $columnNumber = intval($columnNumber / 26);
        }
        return $columnLetter;
    }

    public function styles(Worksheet $sheet)
    {
        // Convert column number to Excel column letter (A, B, C, ..., Z, AA, AB, etc.)
        $lastColumn = $this->getColumnLetter(count($this->headers));
        $lastRow = $this->data->count() + 1;

        // Apply styles after data is loaded
        $styles = [
            // Header row styling
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2563EB'] // Blue color
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THICK,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
        ];

        // Apply borders to all data cells
        if ($lastRow > 1) {
            $styles["A1:{$lastColumn}{$lastRow}"] = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ];
        }

        return $styles;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function properties(): array
    {
        return [
            'creator'        => 'Smile Suite',
            'lastModifiedBy' => 'Smile Suite',
            'title'          => $this->title,
            'description'    => 'Generated report from Smile Suite Clinic Management System',
            'subject'        => 'Clinic Report',
            'keywords'       => 'clinic,report,export,smile suite',
            'category'       => 'Reports',
            'manager'        => 'Smile Suite System',
            'company'        => 'Smile Suite',
        ];
    }

    public function columnFormats(): array
    {
        $formats = [];

        // Apply specific formatting based on header names
        foreach ($this->headers as $index => $header) {
            $columnLetter = $this->getColumnLetter($index + 1); // A, B, C, etc.

            switch (strtolower($header)) {
                case 'amount':
                case 'cost':
                case 'price':
                case 'total':
                case 'revenue':
                case 'payment':
                case 'unit price':
                case 'total value':
                case 'total payments':
                case 'total payments (₱)':
                    $formats[$columnLetter] = '"₱"#,##0.00;-"₱"#,##0.00;"₱"0.00';
                    break;

                case 'date of birth':
                case 'registration date':
                case 'birth date':
                    $formats[$columnLetter] = 'yyyy-mm-dd';
                    break;

                case 'date':
                case 'created date':
                case 'payment date':
                case 'scheduled date':
                case 'start date':
                case 'end date':
                    $formats[$columnLetter] = 'yyyy-mm-dd hh:mm:ss';
                    break;

                case 'phone':
                case 'phone number':
                case 'emergency contact phone':
                case 'contact':
                case 'mobile':
                case 'telephone':
                    $formats[$columnLetter] = '@'; // Text format to preserve leading zeros
                    break;

                case 'percentage':
                case '%':
                    $formats[$columnLetter] = NumberFormat::FORMAT_PERCENTAGE_00;
                    break;

                case 'quantity':
                case 'count':
                case 'number':
                case 'total appointments':
                case 'total treatments':
                case 'patient id':
                case 'age (years)':
                case 'id':
                    $formats[$columnLetter] = '0;-0;0'; // Integer format that shows 0 for zero values
                    break;

                case 'email':
                case 'email address':
                case 'notes':
                case 'description':
                case 'name':
                case 'first name':
                case 'last name':
                case 'emergency contact name':
                case 'gender':
                case 'patient category':
                case 'patient status':
                case 'blood type':
                case 'insurance provider':
                    $formats[$columnLetter] = '@'; // Text format
                    break;
            }
        }

        return $formats;
    }
}
